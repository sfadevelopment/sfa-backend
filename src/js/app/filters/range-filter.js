angular.module('SFA')
    .filter('range', function() {
        return (input, total) => {
            total = parseInt(total);

            for (var i = 0; i < total; i++) {
                input.push(i);
            }

            return input;
        };
    });
