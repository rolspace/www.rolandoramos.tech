var uiSetup = (function($){
	"use strict";
	function activateMenuItem() {
		$('a[href="' + window.location.pathname + '"]').parents('li').addClass('active');
	}
	return {
		init: activateMenuItem
	};
}(jQuery));