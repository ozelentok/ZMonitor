import asyncio
import threading
import logging
import importlib
import json
import random
from django.utils import timezone
from channels import Group

from . import settings
from . import monitors
from .models import MonitorItem
from .rest import MonitorItemSerializer

log = logging.getLogger('zmonitor')


class MonitorEngine:

    _monitors = []

    def register_monitor(self, monitor_config):
        try:
            monitor_class = getattr(monitors, monitor_config['class'])
            monitor_attributes = monitor_config['attributes']
            monitor_name = monitor_attributes['name']
            monitor_item, created = MonitorItem.objects.update_or_create(
                name=monitor_name,
                defaults=monitor_attributes)
            MonitorItem.objects.filter(
                pk=monitor_item.pk).update(**monitor_attributes)
            if not created:
                monitor_item.monitor_loaded = True
                monitor_item.save()
            if monitor_item.is_active:
                monitor = monitor_class(
                    monitor_name, *monitor_config['params'])
                self._monitors.append(monitor)
                log.debug('Monitor Registered: {}'.format(monitor_name))

        except Exception as e:
            log.error('Failed to load monitor: {}\n{!r}'.format(
                e, monitor_config))

    def register_monitors(self):
        config = self.get_configuation()
        MonitorItem.objects.all().update(monitor_loaded=False)
        for monitor_config in config:
            self.register_monitor(monitor_config)
        MonitorItem.objects.filter(monitor_loaded=False).delete()

    def start(self):
        self.register_monitors()
        self._monitors_check_thread = threading.Thread(
            target=self.monitors_check_loop, args=())
        self._monitors_check_thread.start()

    def monitors_check_loop(self):
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        for monitor in self._monitors:
            loop.create_task(self.__class__.monitor_check_wrapper(monitor))
        loop.run_forever()

    @staticmethod
    async def monitor_check_wrapper(monitor):
        while True:
            result = monitor.check()
            monitor_item = MonitorItem.objects.get(name=monitor.name)
            monitor_item.last_update = timezone.now()
            if result:
                monitor_item.last_arrival = timezone.now()
                monitor_item.status = monitor.status
            monitor_item.save()
            Group('updates').send({
                'text': json.dumps({
                    'type': 'item-change',
                    'item-changes': MonitorItemSerializer(monitor_item).data,
                })
            })
            await asyncio.sleep(random.randint(40, 80))

    def get_configuation(self):
        config_file_path = settings.MONITOR_CONFIGURATION_FILE_PATH
        config_module = importlib.import_module(config_file_path)
        return config_module.config
