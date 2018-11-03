from channels.generic.websockets import JsonWebsocketConsumer


class UpdatesServer(JsonWebsocketConsumer):

    strict_ordering = False
    slight_ordering = False

    def connection_groups(self, **kawrgs):
        return ['updates']

    def connect(self, message, **kwargs):
        pass

    def receive(self, message, **kwargs):
        if message['type'] == 'keep-alive':
            self.send({'type': 'keep-alive'})

    def disconnect(cls, message, **kwargs):
        pass
