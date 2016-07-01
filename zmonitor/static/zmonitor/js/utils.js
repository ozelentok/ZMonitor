var Utils = {};

Utils.timeIntervalToMs =  function(timeDiff) {
	var timePattern = /(\d{2}):(\d{2}):(\d{2})/;
	var patternMatch = timePattern.exec(timeDiff);
	if (patternMatch === null) {
		throw Error('String does not contain a time difference');
	}
	var totalSeconds = parseInt(patternMatch[3], 10);
	totalSeconds += parseInt(patternMatch[2], 10) * 60;
	totalSeconds += parseInt(patternMatch[1], 10) * 3600;
	return totalSeconds * 1000;
};

Utils.formatDateTime = function(dateTimeValue) {
	return moment(dateTimeValue).format('YYYY-MM-DD HH:mm:ss ZZ');
};

Utils.formatCurrentTimeDiff = function(dateTimeValue) {
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
};

Utils.graduallyIncreaseOpacity = function($el) {
	$el.css('opacity', 0.1);
	$el.animate({'opacity': 1}, 1200);
};