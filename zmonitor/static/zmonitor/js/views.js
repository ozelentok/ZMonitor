var RootLayout = Mn.LayoutView.extend({
	el: '#zmonitorapp',

	regions: {
		main: '.app-root',
	},
});


var MonitorItemView = Mn.ItemView.extend({
	tagName: 'tr',
	template: '#template-monitor-item',
	templateHelpers: {
		moment: moment,
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
					return this.formatDateTime(values[0]);
				}
				return 'Did not arrive';
			},
		},
		'.monitor-item-last-update': {
			observe: ['last_update'],
			onGet: function (values) {
				if (values[0]) {
					return this.formatDateTime(values[0]);
				}
				return 'No update';
			},
		},
		'.monitor-item-arrival-interval': 'arrival_interval',
	},
	onRender: function() {
		this.stickit();
	},
	formatDateTime: function(dateTimeValue) {
		return moment(dateTimeValue).format('YYYY-MM-DD HH:mm:ss ZZ');
	}
});

var MonitorItemsView = Mn.CompositeView.extend({
	template: '#template-monitor-items',
	childView: MonitorItemView,
	childViewContainer: "tbody",

	onShow: function() {
		$.bootstrapSortable(true);
	}
});
