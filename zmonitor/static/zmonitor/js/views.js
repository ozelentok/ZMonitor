var RootLayout = Mn.LayoutView.extend({
	el: '#zmonitorapp',

	regions: {
		main: '.app-root',
	},
});

var OpacityViewHandler = {
	selector: 'td',
	initialize: Utils.graduallyIncreaseOpacity,
	afterUpdate: Utils.graduallyIncreaseOpacity,
};

Backbone.Stickit.addHandler(OpacityViewHandler);

var MonitorItemView = Mn.ItemView.extend({
	tagName: 'tr',
	template: '#template-monitor-item',
	ui: {
		'itemLastArrival': '.monitor-item-last-arrival',
	},
	bindings: {
		'.monitor-item-pk': 'pk',
		'.monitor-item-name': 'name',
		'.monitor-item-source': 'source',
		'.monitor-item-description': 'description',
		'.monitor-item-status': 'status',
		'.monitor-item-last-arrival': {
			observe: ['last_arrival'],
			onGet: function (values) {
				if (values[0]) {
					return Utils.formatDateTime(values[0]) + '\n' +
						Utils.formatCurrentTimeDiff(values[0]);
				}
				return 'Did not arrive';
			},
			initialize: 'onNewArrival',
			afterUpdate: 'onNewArrival',
		},
		'.monitor-item-last-update': {
			observe: ['last_update'],
			onGet: function (values) {
				if (values[0]) {
					return Utils.formatDateTime(values[0]) + '\n' +
						Utils.formatCurrentTimeDiff(values[0]);
				}
				return 'No update';
			},
			initialize: 'onNewUpdate',
			afterUpdate: 'onNewUpdate',
		},
		'.monitor-item-arrival-interval': 'arrival_interval',
	},
	onRender: function() {
		this.stickit();
	},
	onNewArrival: function($el) {
		OpacityViewHandler.afterUpdate($el);
		var lastArrival = moment(this.model.get('last_arrival'));
		var msDiff = Date.now() - lastArrival;
		var timeIntervalMs = Utils.timeIntervalToMs(this.model.get('arrival_interval'));
		if (msDiff <= timeIntervalMs) {
			$el.css('color', '#0099FF');
		} else if (msDiff <= 2 * timeIntervalMs) {
			$el.css('color', '#99FF00');
		} else {
			$el.css('color', '#FF3300');
		}
	},
	onNewUpdate: function($el) {
		OpacityViewHandler.afterUpdate($el);
		var lastUpdate = moment(this.model.get('last_update'));
		var msDiff = Date.now() - lastUpdate;
		if (msDiff <= 5 * 60 * 1000) {
			$el.css('color', '#0099FF');
		} else {
			$el.css('color', '#FF3300');
		}
		this.onNewArrival(this.ui.itemLastArrival);
	},

});

var MonitorItemsView = Mn.CompositeView.extend({
	template: '#template-monitor-items',
	childView: MonitorItemView,
	childViewContainer: "tbody",

	onShow: function() {
		$.bootstrapSortable(true);
	}
});
