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
        
        self.wrapStringValue = function (value) {
            if (typeof value === 'string') {
                value = '"' + value + '"';
            }
            return value;
        };
        
        self.expandArrayToString = function (arrayValue) {
            var stringValue = '[';
            $.each(arrayValue, function (index, value) {
                stringValue += self.wrapStringValue(value) + ',';
            });
            stringValue = stringValue.slice(0, stringValue.length - 1);
            stringValue += ']';
            return stringValue;
        };

        self.expandStringFieldToHash = function (fieldName, fieldValue) {
            var keys = fieldName.replace(/\]/g, '').split('[');
            var hashStart = '{';
            var hashEnd = '';
            $.each(keys, function (index, value) {
                hashStart += '"' + value + '":{';
                hashEnd += '}';
            });
            hashStart = hashStart.slice(0, hashStart.length - 1);
            if ($.isArray(fieldValue)) {
                fieldValue = self.expandArrayToString(fieldValue);
            } else {
                fieldValue = self.wrapStringValue(fieldValue);
            }
            hashStart += fieldValue;
            var hash = hashStart + hashEnd;
            return JSON.parse(hash);
        };

        self.formHash = {};
        self.addHashFieldToFormHash = function (hashField) {
            $.extend(true, self.formHash, hashField);
        };

        self.serializedFormData = $self.serializeArray();
        self.filteredFields = {};
        
        $.each(self.serializedFormData, function (index, field) {
            if (self.filteredFields[field.name]) {
                var existentData = self.filteredFields[field.name];
                if (!$.isArray(existentData)) {
                    self.filteredFields[field.name] = [existentData];
                }
                self.filteredFields[field.name].push(field.value);
            } else {
                self.filteredFields[field.name] = field.value;
            }
        });

        $.each(self.filteredFields, function (name, value) {
            var hashField = self.expandStringFieldToHash(name, value);
            self.addHashFieldToFormHash(hashField);
        });

        return self.formHash;
    };
})(jQuery);
