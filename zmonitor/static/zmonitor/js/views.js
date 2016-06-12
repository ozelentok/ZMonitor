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
});

var MonitorItemsView = Mn.CompositeView.extend({
	template: '#template-monitor-items',
	childView: MonitorItemView,
	childViewContainer: "tbody",

	onShow: function() {
		$.bootstrapSortable();
	}
});
