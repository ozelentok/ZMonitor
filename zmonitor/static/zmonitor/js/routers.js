var ZMonitorRouter = Mn.AppRouter.extend({
	routes: {
		"": "zmonitor",
	},

	initialize: function() {
		this.monitorItems = new MonitorItems();
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
