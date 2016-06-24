var ZMonitorRouter = Mn.AppRouter.extend({
	routes: {
		"": "zmonitor",
	},

	initialize: function() {
		this.monitorItems = new MonitorItems();
		var self = this;
		this.socket = ZMonitorSocket(window.location.host, '/updates', function(evt) {
			var item_updates = JSON.parse(evt.data);
			var itemId = item_updates['pk'];
			var item = self.monitorItems.get(itemId);
			item.set(item_updates);
		});
	},

	zmonitor: function() {
		var self = this;
		this.monitorItems.fetch({
			success: function(model, response, options) {
				self.showMonitorItems(self.monitorItems);
			},
		});
	},

	showMonitorItems: function(monitorItems) {
		app.root.showChildView('main', new MonitorItemsView({
			collection: monitorItems,
		}));
	},
});

var ZMonitorSocket = function(hostname, path, onMessage) {
	var wsScheme = window.location.protocol == "https:" ? "wss" : "ws";
	this.socket = new WebSocket(wsScheme + '://' + hostname + path);
	this.socket.onmessage = onMessage;
}
