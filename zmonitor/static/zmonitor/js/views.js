var RootLayout = Mn.LayoutView.extend({
	el: '#zmonitorapp',

	regions: {
		main: '.app-root',
		settings: '.app-settings',
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
				return Utils.formatFullDateTime(values[0]);
			},
			initialize: 'onNewArrival',
		},
		'.monitor-item-last-update': {
			observe: ['last_update'],
			onGet: function(values) {
				return Utils.formatFullDateTime(values[0]);
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
		'.monitor-item-notes': 'notes',
	},
	onRender: function() {
		this.stickit();
		var RERENDER_INTERVAL_MAX = 30000;
		var RERENDER_INTERVAL_MIN = 10000;
		var self = this;
		setInterval(function() {
			self.model.trigger('change:last_arrival');
			self.model.trigger('change:last_update');
		}, _.random(RERENDER_INTERVAL_MIN, RERENDER_INTERVAL_MAX));
	},
	onNewArrival: function($el) {
		OpacityViewHandler.afterUpdate($el);
		this.$el.toggleClass('inactive-item', !this.model.get('is_active'));
		var lastArrival = moment(this.model.get('last_arrival'));
		var msDiff = Date.now() - lastArrival;
		var timeIntervalMs = Utils.timeIntervalToMs(this.model.get('arrival_interval'));
		if (msDiff <= timeIntervalMs) {
			$el.css('color', '#0044FF');
		} else if (msDiff <= 1.2 * timeIntervalMs) {
			$el.css('color', '#007777');
		} else {
			$el.css('color', '#FF0000');
			if (app.settings.get('notificationsEnabled')) {
				var title = this.model.get('name') + ' has not arrived';
				var body = 'Last arrived at: ' + Utils.formatFullDateTime(this.model.get('last_arrival'));
				Utils.showNotification(title, body);
			}
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

var AppSettingsView = Mn.ItemView.extend({
	template: '#template-app-settings',

	ui: {
		notificationsSwitch: '.settings-notifications',
	},

	events: {
		'switchChange.bootstrapSwitch': function(evt, state) {
			var self = this;
			Utils.requestNotificationsPermissions(function(permissionGranted) {
				if (!permissionGranted) {
					self.ui.notificationsSwitch.bootstrapSwitch('state', false, true);
					return;
				}
				self.model.save({
					'notificationsEnabled': state
				});
			});
		},
	},

	onShow: function() {
		this.ui.notificationsSwitch.bootstrapSwitch('state', this.model.get('notificationsEnabled'), true);
	}
});
