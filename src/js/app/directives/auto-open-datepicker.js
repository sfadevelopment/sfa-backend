angular.module('SFA')
    .directive('autoOpen', function($parse, $timeout) {
        return {
            link: (scope, iElement, iAttrs) => {
                let isolatedScope = iElement.isolateScope();
                iElement.on("focus", () => {
                    $timeout(function() {
                        isolatedScope.$apply(() => {
                            $parse("isOpen").assign(isolatedScope, "true");
                        });
                    });
                });
            }
        };
    });
