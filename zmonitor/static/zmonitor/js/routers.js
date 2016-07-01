var ZMonitorRouter = Mn.AppRouter.extend({
	routes: {
		"": "zmonitor",
	},

	initialize: function() {
		this.monitorItems = new MonitorItems();
		this.settings = new AppSettings();
		this.initializeSocket();
	},

	initializeSocket: function() {
		var self = this;
		this.socket = new ZMonitorSocket(window.location.host, '/updates', {
			'item-change': function(message) {
				var itemChanges = message['item-changes'];
				var itemId = itemChanges.pk;
				var item = self.monitorItems.get(itemId);
				item.set(itemChanges);
			}});
	},

	zmonitor: function() {
		var self = this;
		this.monitorItems.fetch({
			success: function() {
				self.showAppSettings();
				self.showMonitorItems(self.monitorItems);
			},
		});
	},

	showAppSettings: function() {
		var self = this;
		app.settings = this.settings;
		this.settings.fetch({
			success: function() {
				app.root.showChildView('settings', new AppSettingsView({
					model: self.settings,
				}));
			},
			error: function(model, response, options) {
				self.settings.save();
				app.root.showChildView('settings', new AppSettingsView({
					model: self.settings,
				}));
			}
		});
	},

	showMonitorItems: function(monitorItems) {
		var monitorGroupsRaw = monitorItems.groupBy('group_name');
		var monitorGroups =_.map(monitorGroupsRaw, function(groupRaw, groupName) {
			return new MonitorGroup({
				'name': groupName,
				'monitorItems': new MonitorItems(groupRaw),
			});
		});
		app.root.showChildView('main', new MonitorGroupsView({
			collection: new MonitorGroups(monitorGroups),
		}));
	},
});

var ZMonitorSocket = function(hostname, path, messageHandlers) {
	this.messageHandlers = messageHandlers;
	this.socketHostname = hostname;
	this.socketPath = path;
	this.connect();
};

ZMonitorSocket.prototype.connect = function() {
	var wsScheme = window.location.protocol == "https:" ? "wss" : "ws";
	var self = this;
	this.socket = new WebSocket(wsScheme + '://' + this.socketHostname + this.socketPath);
	this.socket.onmessage = function(evt) {
		self.onMessage(evt);
	};
	this.socket.onerror = function(evt) {
		self.onError(evt);
	};
	this.initializeKeepAliveTimer();
};

ZMonitorSocket.prototype.initializeKeepAliveTimer = function() {
	var KEEP_ALIVE_INTERVAL_MS = 60 * 1000;
	var KEEP_ALIVE_TIMEOUT_MS = 180 * 1000;
	var self = this;
	this.lastSocketCommunication = new Date();
	if (this.hasOwnProperty('keepAliveTimer')) {
		clearInterval(this.keepAliveTimer);
	}
	this.keepAliveTimer = setInterval(function() {
		var currentTime = new Date();
		if (currentTime - self.lastSocketCommunication > KEEP_ALIVE_TIMEOUT_MS) {
			console.debug('WebSocket disconnected, reconnecting');
			self.connect();
			return;
		}
		self.send({
			'type': 'keep-alive',
		});
	}, KEEP_ALIVE_INTERVAL_MS);
};

ZMonitorSocket.prototype.onMessage = function(evt) {
	var message = JSON.parse(evt.data);
	var messageType = message.type;
	this.lastSocketCommunication = new Date();
	if (messageType === 'keep-alive') {
		return;
	}
	if (this.messageHandlers.hasOwnProperty(messageType)) {
		this.messageHandlers[messageType](message);
	}
};

ZMonitorSocket.prototype.onError = function(evt) {
	clearInterval(this.keepAliveTimer);
	alert('Failed to connect to server, please inform the administrator');
};

ZMonitorSocket.prototype.send = function(message) {
	this.socket.send(JSON.stringify(message));
};
