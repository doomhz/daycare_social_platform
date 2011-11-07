function equalHeight(group) {
	var tallest = 0;
	group.each(function() { 
		var thisHeight = $(this).height();
		if(thisHeight > tallest) {
			tallest = thisHeight;
		}
	});
	group.height(tallest);
}
$(document).ready(function() {
	equalHeight($(".form-equal"));
});
$(window).resize(function() {
	equalHeight($(".form-equal"));
});

