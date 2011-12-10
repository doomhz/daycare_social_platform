/**
* Jquery Doom Windows Plugin
*
* jQuery plugin to display modal windows and alerts.
*
* @author Dumitru Glavan
* @link http://dumitruglavan.com/jquery-doom-windows-plugin-simple-javascript-dialogs/
* @version 1.4 (30-SEP-2011)
* @requires jQuery v1.3.2 or later
*
* Find source on GitHub: https://github.com/doomhz/jQuery-Doom-Windows
*
* Dual licensed under the MIT and GPL licenses:
*   http://www.opensource.org/licenses/mit-license.php
*   http://www.gnu.org/licenses/gpl.html
*
*/
(function ($) {

    $.fn.doomWindows = function (options) {

    	if ($(this).length > 1) {
			$.each($(this), function (i, el) {
				$(el).doomWindows(options);
			});
			return this;
		}

		this.config = {
            styles: {
                position: 'absolute',
                'z-index': 999,
                top: false,
                left: false
            },
            width: 'auto',
            height: 'auto',
            minWidth: 'auto',
            minHeight: 'auto',
            overlay: true,
            wrapp: true,
            wrapperClass: 'doom-win',
            wrapperId: false,
            wrapperHtml: '<div><div class="doom-win-content"></div></div>',
            buttons: {
                ok:'Ok'
            },
            headerButtons: {
                close:'Close'
            },
            buttonsTranslate: [],
            buttonsHeaderWrapperHtml: '<div class="doom-win-bt-cnt-header"><ul class="doom-win-bt-list">{buttons}</ul></div>',
            buttonsWrapperHtml: '<div class="doom-win-bt-cnt"><ul class="doom-win-bt-list">{buttons}</ul></div>',
            buttonHtml: '<li class="doom-win-bt-{buttonType}"><button data-type="{buttonType}"><span>{buttonText}</span></button></li>',
            buttonClick: null,
            eventsNamespace: null,
            closeOnEsc: true,
            closeOnSideClick: true,
            onClose: null,
            onEsc: function () {
                $(this).close();
            },
            onSideClick: function () {
                $(this).close();
            },
            ajaxUrl: null,
            afterAjax: null,
            ajaxData: null,
            cacheAjaxResult: false,
            onShow: null
        };
		$.extend(this.config, options);

		var self = this;
		var $self = $(this);

		if (self.config.wrapp) {
			var wrapper = $(self.config.wrapperHtml);
			self.winContent = $('div.doom-win-content', wrapper);
			self.winContent.html($self);
			if (self.config.wrapperId) {
				wrapper.attr('id', self.config.wrapperId);
			}
			wrapper.addClass(self.config.wrapperClass || '');
			wrapper.prependTo('body:first');
			self.config.wrapp = false;
			return wrapper.doomWindows(self.config);
		}

		var lastZIndex = parseInt($('div.doom-win:eq(1)').css('z-index')) || self.config.styles['z-index'];

		if (self.config.overlay) {
			lastZIndex++;
			var $overlay = $('<div class="doom-win-overlay"></div>').css({
                position: 'absolute',
				'z-index': lastZIndex,
				width: '100%',
				height: $(document).height()
		    }).prependTo('body:first');
            if (self.config.closeOnSideClick) {
                $overlay.click(function () {
                    $.isFunction(self.config.onSideClick) && self.config.onSideClick.call(self);
                });
            }
		}

		self.winContent = $('div.doom-win-content', $self);
		self.winContent.css({width: self.config.width, height: self.config.height}).css({minWidth: self.config.minWidth, minHeight: self.config.minHeight});

		lastZIndex++;
		self.config.styles['z-index'] = lastZIndex;
		$self.css(self.config.styles);
		$self.css({top:self.config.styles.top || self.getMiddlePosition.call(self).top});
		$self.css({left:self.config.styles.left || self.getMiddlePosition.call(self).left});


		// Add buttons to the window
		var addButtons = function (buttonsList, wrapper, placement) {
			var buttons = '';
			$.each(buttonsList, function (key, text) {
				text = self.config.buttonsTranslate[key] || text;
				buttons += self.config.buttonHtml.replace(/{buttonType}/g, key).replace(/{buttonText}/g, text);
			});
			buttons = $(wrapper.replace('{buttons}', buttons));
			placement === 'prepend' ? buttons.prependTo(self) : buttons.appendTo(self);
			if (typeof(self.config.buttonClick) === 'function') {
				$('button', buttons).each(function (index, el) {
					$(el).click(function (ev) {
						self.config.buttonClick($(this).attr('data-type'), $self, ev, this);
					});
				});
			}
		}
		typeof self.config.buttons === 'object' && addButtons(self.config.buttons, self.config.buttonsWrapperHtml, 'append');
		typeof self.config.headerButtons === 'object' && addButtons(self.config.headerButtons, self.config.buttonsHeaderWrapperHtml, 'prepend');


		self.config.ajaxUrl =  self.config.ajaxUrl || $self.attr('data-url') || $self.attr('href');
		self.config.ajaxUrl && self.loadContent({ajaxUrl: self.config.ajaxUrl, ajaxData: self.config.ajaxData, cacheResult: self.config.cacheAjaxResult, afterAjax: self.config.afterAjax});

        self.config.eventsNamespace = self.config.eventsNamespace || ('doom-win-'+ new Date().getTime());

		$(window).bind('resize.' + self.config.eventsNamespace, function () {
			$self.css({top:self.config.styles.top || self.getMiddlePosition.call(self).top});
			$self.css({left:self.config.styles.left || self.getMiddlePosition.call(self).left});
		});

		self.config.onShow && self.config.onShow.call($self);
        
		if (self.config.closeOnEsc) {
			$(window).bind('keydown.' + self.config.eventsNamespace, function (ev) {
				if (ev.keyCode == '27') {
                    $.isFunction(self.config.onEsc) && self.config.onEsc.call(self);
				}
			});
		}
        
        $self.data('config', self.config);

		return $(this);
	},

	$.fn.getMiddlePosition = function () {
		var $self = $(this);
		return {
            top: parseInt(($(window).height() - $self.height()) / 2) + $(window).scrollTop(),
			left: parseInt(($(window).width() - $self.width()) / 2)
        };
	},

	$.fn.loadContent = function (options) {
		var config = $.extend({
			ajaxUrl: null,
			ajaxData: null,
			afterAjax: null,
			cacheResult: false,
			htmlData: null
		}, options);
		var self = this, $self = $(self);
		var winContent = $('div.doom-win-content', $self);

		if (config.htmlData) {
			winContent.html(config.htmlData);
		} else {
			winContent.addClass('doom-win-ajax-loading').empty();
			$.ajax({
				url: config.ajaxUrl,
				data: config.ajaxData,
				cacheResult: config.cacheResult,
				success: function (response) {
					winContent.html(response);
					winContent.removeClass('doom-win-ajax-loading');
					$.isFunction(config.afterAjax) && config.afterAjax.call(self, response, winContent);
					$(window).trigger('resize');
				}
			});
		}
	},

	$.fn.close = function () {
		var $self = $(this), config = $self.data('config');
        $.isFunction(config.onClose) && config.onClose.call(this);
        $(window).unbind('keydown.' + config.eventsNamespace).unbind('resize.' + config.eventsNamespace);
		$self.remove();
		$('div.doom-win-overlay:first').remove();
	},

	dWindow = function (content, options) {
		options = $.extend({buttons: false}, options);
		options.buttonClick = typeof(options.buttonClick) === 'function' ? options.buttonClick : function (btType, win) {btType === 'close' && win.close();};
		content = content || '';
		$(content).doomWindows(options);
	},

	dAlert = function (message, callback) {
		callback = typeof(callback) === 'function' ? callback : function (btType, win) {win.close();};
		$('<p class="d-alert-msg">' + message + '</p>').doomWindows({wrapperClass: 'doom-win doom-win-alert', buttons: false, buttonClick: callback});
	},

	dConfirm = function (message, callback) {
		callback = typeof(callback) === 'function' ? callback : function (btType, win) {(btType === 'no' || btType === 'close') && win.close();};
		$('<p class="d-confirm-msg">' + message + '</p>').doomWindows({wrapperClass: 'doom-win doom-win-confirm', buttons: {yes:'Yes', no:'No'}, buttonClick: callback});
	},

	dPrompt = function () {
		alert('Sorry, not yet. :)');
	}

})(jQuery);