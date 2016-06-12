#TODO: Rewrite everything in this file

import re
import json
import logging
from channels import Group
from channels.sessions import channel_session

log = logging.getLogger(__name__)

class UpdatesManager:
    def connect(cls, message):
        pass
        #dest_user = Group('room_{}'.format(new_room.pk), channel_layer=message.channel_layer)
        #message.channel_session['room_id'] = new_room.pk
        #pass

    @classmethod
    def recv(cls, message):
        pass
        #try:
        #    data = json.loads(message['text'])
        #except ValueError:
        #    log.debug("ws message isn't json text=%s", text)
        #    return

        #if set(data.keys()) != set(['message']):
        #    log.debug("ws message unexpected format data=%s", data)
        #    return

        #if data:
        #    room = Room.objects.get(pk=message.channel_session['room_id'])
        #    room_group = Group('room_{}'.format(room.pk),
        #        channel_layer=message.channel_layer)
        #    log.debug('chat message room=%s user=%s message=%s',
        #              room.label, message.user.username, data['message'])
        #    m = room.messages.create(room=room, message=data['message'], user=message.user)

        #    message_dict = m.as_dict()
        #    message_dict['user'] = m.user.username
        #    room_group.send({
        #        'text': json.dumps(message_dict),
        #    })

    @classmethod
    def disconnect(cls, message):
        pass
        #room = Room.objects.get(pk=message.channel_session['room_id'])
        #room_group = Group('room_{}'.format(room.pk),
        #    channel_layer=message.channel_layer)
        #room_group.discard(message.reply_channel)

def ws_connect(message):
    log.debug('path')
    log.debug(message['path'])
    log.debug('client')
    log.debug(message['client'])

    message.channel_session['handler'] = UpdatesManager()
    message['cls'].connect(message)

def ws_receive(message):
    message['cls'].recv(message)

def ws_disconnect(message):
    message['cls'].disconnect(message)
