from channels.generic.websockets import JsonWebsocketConsumer

class UpdatesServer(JsonWebsocketConsumer):

    strict_ordering = False
    slight_ordering = False

    def connection_groups(self, **kawrgs):
        return ['updates']

    def connect(self, message, **kwargs):
        pass

    def recv(cls, content, **kwargs):
        pass

    def disconnect(cls, message, **kwargs):
        pass

    def send(self, data):
        pass
