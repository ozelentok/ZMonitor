from django.db import models
from datetime import datetime

class MonitorItem(models.Model):
    name = models.CharField(max_length=200)
    source = models.CharField(max_length=200)
    description = models.TextField(blank=False)
    lastArrival = models.DateTimeField(blank=True)
    lastUpdate = models.DateTimeField(blank=False)
