angular.module('SFA')
    .directive('onFileChange', function() {
        return {
            restrict: 'A',
            require: 'ngModel',
            scope: {
                onFileChange: '&'
            },
            link: function link(scope, element, attrs, ctrl) {
                element.on('change', onChange);

                scope.$on('destroy', function() {
                    element.off('change', onChange);
                });

                function onChange() {
                    if (attrs.multiple) {
                        ctrl.$setViewValue(element[0].files);
                    } else {
                        ctrl.$setViewValue(element[0].files[0]);
                    }

                    scope.$apply(function() {
                        scope.onFileChange();
                    });
                }
            }
        };
    });
