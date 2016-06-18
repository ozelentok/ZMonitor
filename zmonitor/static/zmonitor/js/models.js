var MonitorItem = Backbone.Model.extend({
	idAttribute: 'pk',
	urlRoot: '/api/monitor-items',

	defaults: {
		pk: 0,
		name: '',
		source: '',
		description: false,
		last_arrival: new Date(1970, 0),
		last_update: new Date(1970, 0),
	},
});

var MonitorItems = Backbone.Collection.extend({
	model: MonitorItem,
	url: '/api/monitor-items'
});
