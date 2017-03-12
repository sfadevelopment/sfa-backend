angular.module('SFA')
    .directive('creditCardForm', function($locale) {

        return {
            templateUrl: 'credit-card-form.html',
            scope: {
                form: '=',
                cardData: '='
            },
            link: function($scope, element, attrs, model) {

                $scope.months = $locale.DATETIME_FORMATS.MONTH;
                $scope.form = $scope.cardForm;

                $scope.hasError = function(form, field, validation) {
                    if (form) {
                        if (validation) {
                            return ($scope[form][field].$dirty && $scope[form][field].$error[validation]) || ($scope[form].$submitted && $scope[form][field].$error[validation]);
                        }
                        return ($scope[form][field].$dirty && $scope[form][field].$invalid) || ($scope[form].$submitted && $scope[form][field].$invalid);
                    } else {
                        return false;
                    }
                };
            }
        };
    })
    .directive('creditCardNumber', function() {
        let directive = {
            require: 'ngModel',
            link: function(scope, elm, attrs, ctrl) {
                ctrl.$validators.invalidCardNumber = function(value) {

                    if (value || elm[0].value.length > 0) {
                        let type = (/^5[1-5]/.test(value)) ? "mastercard" : (/^4/.test(value)) ? "visa" : (/^3[47]/.test(value)) ? 'amex' : (/^6011|65|64[4-9]|622(1(2[6-9]|[3-9]\d)|[2-8]\d{2}|9([01]\d|2[0-5]))/.test(value)) ? 'discover' : undefined;
                        return !!type;
                    } else {
                        return true;
                    }
                };
            }
        };
        return directive;
    });
