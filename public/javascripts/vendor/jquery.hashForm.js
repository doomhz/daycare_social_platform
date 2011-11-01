/**
* jQuery Hash Form Plugin
*
* Get form values as object.
*
* @author Dumitru Glavan
* @version 1.0
* @requires jQuery v1.5 or later
*
* Examples and documentation at: https://github.com/doomhz/jQuery-Hash-Form
* Dual licensed under the MIT and GPL licenses:
*   http://www.opensource.org/licenses/mit-license.php
*   http://www.gnu.org/licenses/gpl.html
*
*/
(function ($) {
    $.fn.hashForm = function () {
        var self = this, $self = $(this);

        self.expandStringFieldToHash = function (fieldName, fieldValue) {
            var keys = fieldName.replace(/\]/g, '').split('[');
            var hashStart = '{';
            var hashEnd = '';
            $.each(keys, function (index, value) {
                hashStart += '"' + value + '":{';
                hashEnd += '}';
            });
            hashStart = hashStart.slice(0, hashStart.length - 1);
            hashStart += '"' + fieldValue + '"';
            var hash = hashStart + hashEnd;
            return JSON.parse(hash);
        };

        self.addFieldToHash = function (field) {
            var hash = self.expandStringFieldToHash(field.name, field.value)
            $.extend(true, formHash, hash);
        }

        var serializedFormData = $self.serializeArray();
        var formHash = {};

        $.each(serializedFormData, function (index, field) {
            self.addFieldToHash(field);
        });

        return formHash;
    }
})(jQuery);
