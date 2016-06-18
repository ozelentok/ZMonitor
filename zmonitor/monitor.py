from abc import ABC, abstractmethod
import glob
import os
import asyncio
import threading
import logging
import importlib
from django.utils import timezone
from . import settings
from .models import MonitorItem

log = logging.getLogger('zmonitor')

class BaseMonitor(ABC):

    def __init__(self, name):
        self.name = name
        self.status = 'No File Arrived'

    @abstractmethod
    def check(self):
        pass

    @property
    def name(self):
        return self._name

    @name.setter
    def name(self, value):
        self._name = value

    @property
    def status(self):
        return self._status

    @status.setter
    def status(self, value):
        self._status = value

class FileExistenceMonitor(BaseMonitor):

    def __init__(self, name, glob_patterns):
        super().__init__(name)
        self._glob_patterns = glob_patterns
        self._last_file_path = None

    def check(self):
        files_found = []
        for glob_pattern in self._glob_patterns:
            files_found += glob.glob(glob_pattern)
        files_found.sort(key=os.path.getmtime)
        if len(files_found) == 0:
            return False
        if files_found[-1] == self._last_file_path:
            return False
        self._last_file_path = files_found[-1]
        self.status = 'File Arrived'
        return True

class MonitorEngine:

    _monitors = []

    def register_monitor(self, monitor_config):
        try:
            monitor_class = globals()[monitor_config['monitor']]
            monitor = monitor_class(monitor_config['name'], *monitor_config['monitor_params'])
            monitor_item, created = MonitorItem.objects.get_or_create(
                    name=monitor_config['name'],
                    defaults={
                        'source': monitor_config['source'],
                        'description': monitor_config['description'],
                        'arrival_interval' : monitor_config['arrival_interval'],
                        'is_active' : monitor_config['is_active'],
                        'status' : '',
                        'notes' : '',
                        'monitor_loaded': True,
                        })
            if not created:
                monitor_item.monitor_loaded = True
                monitor_item.save()
            self._monitors.append(monitor)

        except Exception as e:
            log.error('Failed to load monitor: {}\n{!r}'.format(e, monitor_config))

    def register_monitors(self):
        config = self.get_configuation()
        MonitorItem.objects.all().update(monitor_loaded=False)
        for monitor_config in config:
            log.debug('registring {!r}'.format(monitor_config))
            self.register_monitor(monitor_config)
        MonitorItem.objects.filter(monitor_loaded=False).delete()

    def start(self):
        self.register_monitors()
        self._monitors_check_thread = threading.Thread(target=self.monitors_check_loop, args=())
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
            await asyncio.sleep(60)

    def get_configuation(self):
        config_file_path = settings.MONITOR_CONFIGURATION_FILE_PATH
        config_module = importlib.import_module(config_file_path)
        return config_module.config
