angular.module('SFA')
    .controller('SubscriberChangePasswordModalController', function($scope, $uibModalInstance, utilsService, userService, SweetAlert) {

        this.close = () => {
            $uibModalInstance.dismiss('cancel');
        };

        this.hasError = (form, field, validation) => {
            return utilsService.hasError($scope, form, field, validation);
        };

        this.onFormSubmit = () => {
            if ($scope.passwordForm.$valid) {
                $scope.inProgress = true;
                userService.changeUserPassword(this.passwordData).then(function() {
                    SweetAlert.swal("Success", 'Password updated successfully', "success");
                    $scope.inProgress = false;
                    $uibModalInstance.dismiss('cancel');

                }, function(err) {
                    SweetAlert.swal("Oops...!", err.message, "error");
                    $scope.inProgress = false;
                });

            }
        };

    });
