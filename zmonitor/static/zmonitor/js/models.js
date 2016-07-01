var MonitorItem = Backbone.Model.extend({
	idAttribute: 'pk',
	urlRoot: '/api/monitor-items',
});

var MonitorItems = Backbone.Collection.extend({
	model: MonitorItem,
	url: '/api/monitor-items'
});

var MonitorGroup = Backbone.Model.extend({
});

var MonitorGroups = Backbone.Collection.extend({
	Model: MonitorGroup,
});

var AppSettings = Backbone.Model.extend({
	localStorage: new Store("AppSettings"),
	defaults: {
		id: 1,
		notificationsEnabled: true,
	}
});
