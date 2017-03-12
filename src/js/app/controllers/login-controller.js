angular.module('SFA')
    .controller('LoginController', function($scope, SweetAlert, utilsService, userService, $window) {
        let self = this;
        self.hasError = (form, field, validation) => {
            return utilsService.hasError($scope, form, field, validation);
        };

        self.login = () => {
            if ($scope.loginForm.$valid) {
                $scope.inProgress = true;
                userService.login(self.loginData).then(function() {
                    $window.location = "/";
                }, function(err) {
                    SweetAlert.swal("Oops...!", err.message, "error");
                    $scope.inProgress = false;
                });
            }
        };

    });
