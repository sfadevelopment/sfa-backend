angular.module('SFA')
    .directive('uiSelectRequired', function() {
        return {
            require: 'ngModel',
            link: function(scope, elm, attrs, ctrl) {
                ctrl.$validators.uiSelectRequired = function(modelValue, viewValue) {
                    if (modelValue && modelValue.length > 0) {
                        return true;
                    }
                    return false;
                };
            }
        };
    });