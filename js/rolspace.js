//Custom jQuery code
$(function(){
	$('a[href="' + this.location.pathname + '"]').parents('li').addClass('active');
});