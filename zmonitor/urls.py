"""zmonitor URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.9/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.conf.urls import url, include
    2. Add a URL to urlpatterns:  url(r'^blog/', include('blog.urls'))
"""

from django.conf.urls import url, include
from django.contrib import admin
from . import views
from . import rest
from . import monitor
import sys

if 'runserver' in sys.argv:
    monitor_engine = monitor.MonitorEngine()
    monitor_engine.start()

urlpatterns = [
    url(r'^admin/', admin.site.urls),
    url(r'^api/', include(rest.urlpatterns)),
    url(r'^$', views.MonitorView.as_view(), name='monitor'),
]
