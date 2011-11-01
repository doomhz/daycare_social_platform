/**
* Doom Tabs jQuery Plugin
*
* @author Dumitru Glavan
* @version 1.0
*
*/
(function ($) {
	$.fn.doomTabs = function (options) {
		this.config = {tabContainerId:$(this).attr('id'),
					   activeClass:'tab-active',
					   selectedClass:'tab-selected',
					   hiddenClass:'tab-hidden',
					   afterAjax:null,
                       firstSelectedTab: 1,
                       onSelect: null
				 };
		$.extend(this.config, options);

		this.tabContainer = $('#' + this.config.tabContainerId);
		this.tabButtons = $('ul:first li', this.tabContainer);
		this.allTabs = $('> div', this.tabContainer);

		var self = this;

		$(this).data('_self', self);

		this.tabButtons.click(
			function (ev) {
				self.selectTab(this, ev);
				return false;
			}
		);

		var $firstTabToSelect = this.tabButtons.filter(':eq(' + (this.config.firstSelectedTab) + ')');
        $firstTabToSelect.trigger('click');

		return this;
	},

	$.fn.selectTab = function (tabButton, event) {
		var self = $(this).data('_self');

		if (typeof(tabButton) === 'undefined') {
			throw 'selectTab() expects a tabButton parameter.';
		}

		if ((typeof(tabButton) === 'number') || (typeof(tabButton) === 'string')) {
			tabButton = self.tabButtons.eq(tabButton - 1);
			if (!tabButton.length) {
				throw 'Invalid tab index. selectTab() expects a numeric tab index starting with 1.';
			}
		}

		self.tabButtons.removeClass(self.config.activeClass);
		$(tabButton).addClass(self.config.activeClass);

		var tabLink = $('a:first', tabButton);
		var showTabId = tabLink.attr('href');

		self.allTabs.addClass(self.config.hiddenClass).removeClass(self.config.selectedClass);

		var selectedTab = $(showTabId, self.tabContainer);
		selectedTab.removeClass(self.config.hiddenClass).addClass(self.config.selectedClass);

		$.isFunction(self.config.onSelect) && self.config.onSelect(selectedTab);

		if (tabLink.attr('data-url')) {
			$(showTabId, self.tabContainer).empty();
			$(showTabId, self.tabContainer).addClass('doom-tabs-ajax-loading');
			$(showTabId, self.tabContainer).load(tabLink.attr('data-url'), function (response) {
				$(this).removeClass('doom-tabs-ajax-loading');
				$.isFunction(self.config.afterAjax) && self.config.afterAjax(selectedTab, response);
			});
		}
	}
})(jQuery);