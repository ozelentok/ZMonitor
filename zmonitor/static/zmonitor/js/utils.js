var Utils = {};

Utils.timeIntervalToMs =  function(timeDiff) {
	var timePattern = /(\d+)\s+(\d{2}):(\d{2}):(\d{2})/;
	var timePattern2 = /(\d{2}):(\d{2}):(\d{2})/;
	var patternMatch = timePattern.exec(timeDiff);
	var matchesOffset = 0;
	if (patternMatch === null) {
		matchesOffset = 1;
		patternMatch = timePattern2.exec(timeDiff);
		if (patternMatch === null) {
			throw Error('String does not contain a time difference');
		}
	}
	var days = matchesOffset ? '0': patternMatch[1];
	var hours = patternMatch[2 - matchesOffset];
	var minutes = patternMatch[3 - matchesOffset];
	var seconds = patternMatch[4 - matchesOffset];
	return Utils.timeMeasurmentsToMs(
			parseInt(days, 10),
			parseInt(hours, 10),
			parseInt(minutes, 10),
			parseInt(seconds, 10)
			);
};

Utils.timeMeasurmentsToMs = function(days, hours, minutes, seconds) {
	var value = days * 24;
	value = (value + hours) * 60;
	value = (value + minutes) * 60;
	value = (value + seconds) * 1000;
	return value;
};

Utils.formatDateTime = function(dateTimeValue) {
	return moment(dateTimeValue).format('YYYY-MM-DD HH:mm:ss ZZ');
};

Utils.formatCurrentTimeDiff = function(dateTimeValue) {
	var timeDiff = (Date.now() - moment(dateTimeValue));
	return this.formatTimeDiff(timeDiff);
};

Utils.formatTimeDiff = function(timeDiffMs) {
	var timeDiff = timeDiffMs / 1000;
	if (timeDiff < 60 * 2) {
		return Math.round(timeDiff) + ' seconds';
	}
	timeDiff /= 60;
	if (timeDiff < 60 * 2) {
		return Math.round(timeDiff) + ' minutes';
	}
	timeDiff /= 60;
	if (timeDiff < 24 * 2) {
		return Math.round(timeDiff) + ' hours';
	}
	timeDiff /= 24;
	return Math.round(timeDiff) + ' days';
};

Utils.graduallyIncreaseOpacity = function($el) {
	$el.css('opacity', 0.1);
	$el.animate({'opacity': 1}, 1200);
};

Utils.showNotification = function(title, options) {
	if (!("Notification" in window)) {
		return;
	}

	if (Notification.permission === "granted") {
		var notification = new Notification(title, options);
		return;
	}
	Notification.requestPermission(function (permission) {
		if (permission === "granted") {
			var notification = new Notification(title, options);
		}
	});
};
