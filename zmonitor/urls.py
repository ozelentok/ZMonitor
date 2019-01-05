import sys

from django.conf.urls import url, include
from django.contrib import admin
from . import views
from . import rest
from . import monitor


if 'runserver' in sys.argv:
    monitor_engine = monitor.MonitorEngine()
    monitor_engine.start()

urlpatterns = [
    url(r'^admin/', admin.site.urls),
    url(r'^api/', include(rest.urlpatterns)),
    url(r'^$', views.MonitorView.as_view(), name='monitor'),
]
