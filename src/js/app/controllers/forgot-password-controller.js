angular.module('SFA')
    .controller('ForgotPasswordController', function($scope, SweetAlert, utilsService, userService, $window) {
        let self = this;
        self.hasError = (form, field, validation) => {
            return utilsService.hasError($scope, form, field, validation);
        };

        self.forgotPassword = () => {
            if ($scope.forgotForm.$valid) {
                $scope.inProgress = true;
                userService.forgotPassword(self.forgotData).then(function() {
                    $scope.inProgress = false;
                    self.forgotData = {};
                    $scope.forgotForm.$setPristine();
                    SweetAlert.swal("Success!", "We got your request, check your email soon.", "success");
                }, function(err) {
                    SweetAlert.swal("Oops...!", err.message, "error");
                    $scope.inProgress = false;
                });
            }
        };

    });
