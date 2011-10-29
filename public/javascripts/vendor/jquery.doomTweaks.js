/**
* Doom Tweaks for Javascript Projects
*
* @author Dumitru Glavan
* @version 1.1 (16-JUL-2011)
* @requires jQuery
* @link http://dumitruglavan.com
*
* @example: $.l(4,5,6);
* @example: $.time();
* @example: $.lt();$('div')$.lt();
* @example: $.bm('$('div')'); - benchmark your code
* @example: $.mockAjax({mockUrl: '/ajax_mocks'}); - mock your ajax calls
*
* Dual licensed under the MIT and GPL licenses:
*   http://www.opensource.org/licenses/mit-license.php
*   http://www.gnu.org/licenses/gpl.html
*
*/
(function ($) {

    /**
	 * Extend Firebug
	 */
	if (typeof(console) === 'object') {
		/**
		 * Shortcut function for console.log()
		 */
		$.extend($, {
            l: function () {
                for (var i = 0; i < arguments.length; i++) {
                    console.log(arguments[i]);
                }
            }
        });
	}

	/**
	 * Shortcut function for getting timestamp in second (PHP like function time())
	 * @param numeric divideBy - You can switch back to milliseconds by specifying this as 1
	 */
	$.extend($, {
        time: function (divideBy) {
			return ~~(+ (new Date().getTime() / (typeof divideBy === 'undefined' ? 1000 : divideBy)));
		}
    });

	/**
	 * Shortcut function for logging time to the Firebug console
	 * call $.lt() then your code then $.lt() again to get the results
	 */
	$.extend($, {
        lt: function () {
            if (this.ltLastTime == null) {
                return this.ltLastTime = new Date().getTime();
            }
            var diff = new Date().getTime() - this.ltLastTime;
            this.ltLastTime = null;
            $.l(diff);
            return diff;
        },
        ltLastTime: null
	});

	/**
	 * Shortcut function for benchmarking a block of code to the Firebug console
	 * this function will run your code in a for block to create overflow and push the results into Firebug
	 *
	 * @param string benchmarkCode - the block of code you want to benchmark
	 * @param numeric testTime - the number of FOR cicles
	 */
	$.extend($, {
        bm: function (benchmarkCode, testTime) {
            this.testTime = typeof testTime === 'number' ? testTime : 9999;
            $.lt();
            for (var i = 0;i < this.testTime;i++) {
                eval(benchmarkCode);
            }
            $.lt();
        }
	});
        
    /**
     * Mock ajax requests with a prefilter
     *
     */
    $.extend($, {
        mockAjax: function (mockOptions) {
            mockOptions = $.extend({
                mockUrl: '/ajax_mocks'
            }, mockOptions);
            $.ajaxPrefilter(function(options, originalOptions, jqXHR) {
                if (!options.noMock) {
                    options.url = mockOptions.mockUrl + '?ajax_url=' + options.url;
                }
            });
        }
	});
	
})(jQuery);