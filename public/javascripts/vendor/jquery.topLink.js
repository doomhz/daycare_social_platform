/**
* Author: Dumitru Glavan
* Inspired by David Walsh: http://davidwalsh.name/jquery-top-link
*
*/
(function ($) {
  $.fn.topLink = function(options) {

		if ($(this).length > 1) {
			$(this).each(function (i, el) {
				$(el).topLink(options);
			});
			return $(this);
		}

  	options = $.extend({
  		min: 400,
  		fadeSpeed: 500,
  		ieOffset: 50,
  		scrollSpeed: 300
  	}, options);

		//listen for scroll
		var $self = $(this);
		$self.hide(); //in case the user forgot

		$self.click(function(ev) {
      ev.preventDefault();
      $("window,html,body").animate({scrollTop:0}, options.scrollSpeed)
    });

		$(window).scroll(function() {
			//stupid IE hack
			if (!$.support.hrefNormalized) {
				$self.css({
					'position': 'absolute',
					'top': $(window).scrollTop() + $(window).height() - options.ieOffset
				});
			}
			if ($(window).scrollTop() >= options.min) {
				$self.fadeIn(options.fadeSpeed);
			} else {
				$self.fadeOut(options.fadeSpeed);
			}
		});

  	return this;
  };
})(jQuery);
