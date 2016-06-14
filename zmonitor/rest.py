from django.conf.urls import url, include
from rest_framework import routers, serializers, viewsets
from .models import MonitorItem

class MonitorItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = MonitorItem
        fields = ('pk', 'name', 'source', 'description',
                'lastArrival', 'lastUpdate')

class MonitorItemViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = MonitorItemSerializer
    queryset = MonitorItem.objects.all()

router = routers.DefaultRouter(trailing_slash=False)
router.register(r'monitor-items', MonitorItemViewSet, base_name='monitor-item')

urlpatterns = [
    url(r'^', include(router.urls)),
]