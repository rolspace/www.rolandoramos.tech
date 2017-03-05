export class Setup {
	constructor() {

	}

	init() {
		this.activateMenu();
	}

	activateMenu() {
		$('a[href="' + window.location.pathname + '"]').parents('li').addClass('active');
	}
}