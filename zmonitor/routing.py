from channels import route, route_class
from . import consumers

channel_routing = [
    route_class(consumers.UpdatesServer, path=r'^/updates')
]
