angular.module('SFA')
    .controller('SubscriberEditModalController', function($scope, subscriber, $uibModalInstance, utilsService, userService, SweetAlert) {

        this.close = () => {
            $uibModalInstance.dismiss('cancel');
        };

        this.subscriberData = subscriber;

        this.hasError = (form, field, validation) => {
            return utilsService.hasError($scope, form, field, validation);
        };

        this.onFormSubmit = () => {
            if ($scope.accountForm.$valid) {
                $scope.inProgress = true;
                let savedData = this.subscriberData;
                userService.updateSubscriberInfo(savedData).then(function() {
                    $uibModalInstance.close(savedData);
                    $scope.inProgress = false;
                }, function(err) {
                    SweetAlert.swal("Oops...!", err.message, "error");
                    $scope.inProgress = false;
                });

            }
        };

    });
