var RootLayout = Mn.LayoutView.extend({
	el: '#zmonitorapp',

	regions: {
		main: '.app-root',
	},
});

var OpacityViewHandler = {
	selector: 'td',
	afterUpdate: function($el) {
		$el.css('opacity', 0.1);
		$el.animate({'opacity': 1}, 1200);
	},
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
					//return this.formatDateTime(values[0]);
					return this.formatDateTime(values[0]) + '\n' +
						this.formatCurrentTimeDiff(values[0]);
				}
				return 'Did not arrive';
			},
			afterUpdate: 'onNewArrival',
		},
		'.monitor-item-last-update': {
			observe: ['last_update'],
			onGet: function (values) {
				if (values[0]) {
					return this.formatDateTime(values[0]) + '\n' +
						this.formatCurrentTimeDiff(values[0]);
				}
				return 'No update';
			},
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
		var timeIntervalMs = this.timeIntervalToMs(this.model.get('arrival_interval'));
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
	timeIntervalToMs: function(timeDiff) {
		var timePattern = /(\d{2}):(\d{2}):(\d{2})/;
		var patternMatch = timePattern.exec(timeDiff);
		if (patternMatch === null) {
			throw Error('String does not contain a time difference');
		}
		var totalSeconds = parseInt(patternMatch[3], 10);
		totalSeconds += parseInt(patternMatch[2], 10) * 60;
		totalSeconds += parseInt(patternMatch[1], 10) * 3600;
		return totalSeconds * 1000;
	},
	formatDateTime: function(dateTimeValue) {
		return moment(dateTimeValue).format('YYYY-MM-DD HH:mm:ss ZZ');
	},
	formatCurrentTimeDiff: function(dateTimeValue) {
		var timeDiff = (Date.now() - moment(dateTimeValue)) / 1000
		if (timeDiff < 1) {
			return 'Just now'
		} if (timeDiff < 60) {
			return Math.round(timeDiff) + ' seconds ago';
		}
		timeDiff /= 60;
		if (timeDiff < 60) {
			return Math.round(timeDiff) + ' minutes ago';
		}
		timeDiff /= 60;
		if (timeDiff < 24) {
			return Math.round(timeDiff) + ' hours ago';
		}
		timeDiff /= 24;
		return Math.round(timeDiff) + ' days ago';
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
