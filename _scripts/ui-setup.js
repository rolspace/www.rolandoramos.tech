var UISetup = (function($){

	function highlightMenuItem() {
		$('a[href="' + window.location.pathname + '"]').parents('li').addClass('active');
	}

	return {
		init: highlightMenuItem
	}
}(jQuery));