var MonitorItem = Backbone.Model.extend({
	idAttribute: 'pk',
	urlRoot: '/api/monitor-items',

	defaults: {
		pk: 0,
		name: '',
		source: '',
		description: false,
		lastArrival: new Date(1970, 0),
		lastUpdate: new Date(1970, 0),
	},
});

var MonitorItems = Backbone.Collection.extend({
	model: MonitorItem,
	url: '/api/monitor-items'
});
