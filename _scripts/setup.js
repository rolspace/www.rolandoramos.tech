export class Setup {
	init() {
		this.activateMenu();
	}

	activateMenu() {
		$('a[href="' + window.location.pathname + '"]').parents('li').addClass('active');
	}
}