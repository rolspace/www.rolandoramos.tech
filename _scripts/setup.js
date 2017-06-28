export default class Setup {
	init() {
		this.activateMenu();
	}

	activateMenu() {
		$('.navbar a.nav-item[href="' + window.location.pathname + '"]').addClass('active');
	}
}