angular.module('SFA')
    .controller('VerifyAccountController', function($scope, SweetAlert, userService) {
        this.sendVerification = () => {
            $scope.inProgress = true;
               userService.rsendVerificationEmail().then(() => {
                SweetAlert.swal("Success!", "Verification resent. Check your inbox!", "success");
                $scope.inProgress = false;
            }, (err) => {
                SweetAlert.swal("Oops...!", err.message, "error");
                $scope.inProgress = false;
            });
        };

    });
