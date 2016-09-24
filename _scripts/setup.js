function activateMenu() {
	'use strict';
	$('a[href="' + window.location.pathname + '"]').parents('li').addClass('active');
}

export class Setup {
	constructor() {

	}

	init() {
		activateMenu();
	}
}