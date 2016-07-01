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
	bindings: {
		'.monitor-item-pk': 'pk',
		'.monitor-item-name': 'name',
		'.monitor-item-source': 'source',
		'.monitor-item-description': 'description',
		'.monitor-item-status': 'status',
		'.monitor-item-last-arrival': {
			observe: ['last_arrival'],
			onGet: function(values) {
				if (!values[0]) {
					return 'Did not arrive';
				}
				return Utils.formatDateTime(values[0]) + '\n' +
					Utils.formatCurrentTimeDiff(values[0]) + ' ago';
			},
			initialize: 'onNewArrival',
		},
		'.monitor-item-last-update': {
			observe: ['last_update'],
			onGet: function(values) {
				if (!values[0]) {
					return 'No update';
				}
				return Utils.formatDateTime(values[0]) + '\n' +
					Utils.formatCurrentTimeDiff(values[0]) + ' ago';
			},
			initialize: 'onNewUpdate',
			afterUpdate: 'onNewUpdate',
		},
		'.monitor-item-arrival-interval': {
			observe: 'arrival_interval',
			onGet: function(values) {
				return Utils.formatTimeDiff(Utils.timeIntervalToMs(values));
			},
		},
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
			$el.css('color', '#0044FF');
		} else if (msDiff <= 1.2 * timeIntervalMs) {
			$el.css('color', '#007777');
		} else {
			//Utils.showNotification(this.model.get('name') + ' has not arrived', {
			$el.css('color', '#FF0000');
		}
	},
	onNewUpdate: function($el) {
		OpacityViewHandler.afterUpdate($el);
		var lastUpdate = moment(this.model.get('last_update'));
		var msDiff = Date.now() - lastUpdate;
		if (msDiff <= 5 * 60 * 1000) {
			$el.css('color', '#0044FF');
		} else {
			$el.css('color', '#FF0000');
		}
		this.model.trigger('change:last_arrival');
	},
});

var MonitorItemsView = Mn.CompositeView.extend({
	template: '#template-monitor-items',
	childView: MonitorItemView,
	childViewContainer: 'tbody',

	initialize: function(){
    this.collection = this.model.get('monitorItems');
  },

});

var MonitorGroupsView = Mn.CollectionView.extend({
	childView: MonitorItemsView,

	onShow: function() {
		$.bootstrapSortable(true);
	}
});
