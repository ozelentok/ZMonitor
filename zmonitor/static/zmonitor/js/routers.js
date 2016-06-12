var ZMonitorRouter = Mn.AppRouter.extend({
	routes: {
		"": "zmonitor",
	},

	initialize: function() {
		this.monitorItems = new MonitorItems([
			new MonitorItem({pk :0}),
			new MonitorItem({pk: 1}),
			new MonitorItem({pk: 2})]);
	},

	zmonitor: function() {
		this.showMonitorItems(this.monitorItems);
		//this.monitorItems.fetch();
	},

	showMonitorItems: function(monitorItems) {
		app.root.showChildView('main', new MonitorItemsView({
			collection: monitorItems,
		}));
	},
});
