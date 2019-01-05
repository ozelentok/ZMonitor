from channels.generic.websocket import JsonWebsocketConsumer


class UpdatesConsumer(JsonWebsocketConsumer):

    def connect(self):
        self.accept()

    def receive_json(self, content):
        if 'type' in content and content['type'] == 'keep-alive':
            self.send_json({'type': 'keep-alive'})

    def disconnect(cls, message, **kwargs):
        pass
