from django.db import models

class MonitorItem(models.Model):
    name = models.CharField(max_length=200)
    source = models.CharField(max_length=200)
    description = models.TextField(null=False)
    last_arrival = models.DateTimeField(null=True)
    last_update = models.DateTimeField(null=True)
    arrival_interval = models.DurationField()
    is_active = models.BooleanField()
    status = models.TextField(null=False, default='')
    notes = models.TextField(null=False, default='')
    monitor_loaded = models.BooleanField(default=True)
    group_name = models.CharField(max_length=200)
