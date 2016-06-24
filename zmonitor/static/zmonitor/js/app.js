var ZMonitorApp = Mn.Application.extend({
	setRootLayout: function () {
		this.root = new RootLayout();
	}
});

var app = new ZMonitorApp();

app.on('before:start', function () {
	app.setRootLayout();
});

app.on('start', function () {
	this.router = new ZMonitorRouter();
	if (Backbone.history) {
		Backbone.history.start({ pushState: true });
	}
});

app.vent.on('error', function(event, jqxhr){
	alert(jqxhr.responseText);
});

$(document).ajaxError(function(event, jqxhr, settings, thrownError){
	app.vent.trigger('error', event, jqxhr, settings, thrownError);
});

function csrfSafeMethod(method) {
	return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
}


/* No need for CSRF Token in current app
app.csrfToken = $.cookie('csrftoken');

$.ajaxSetup({
	beforeSend: function(xhr, settings) {
		if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
			xhr.setRequestHeader("X-CSRFToken", app.csrfToken);
		}
	}
});
*/

$(document).ready(function() {
	app.start();
});
