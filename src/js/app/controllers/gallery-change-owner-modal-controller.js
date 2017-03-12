angular.module('SFA')
    .controller('GalleryChangeOwnerModalController', function($scope, $uibModalInstance, SweetAlert, galleryId, userService, adminService, currentOwnerId, utilsService) {

        this.close = () => {
            $uibModalInstance.dismiss('cancel');
        };
        this.hasError = (form, field, validation) => {
            return utilsService.hasError($scope, form, field, validation);
        };
        this.getSubscribers = (searchText) => {
            return userService.getSuggestionSuggestionByName(searchText).then((response) => {
                return response.subscribers;
            });
        };

        this.onFormSubmit = () => {
            if (this.ownerData && !this.ownerData.id) {
                this.ownerData = '';
                SweetAlert.swal("Oops...!", 'Select owner from suggestion box', "warning");
                return;
            }
            if ($scope.ownerForm.$valid) {
                $scope.inProgress = true;
                adminService.changeGalleryOwner(galleryId, this.ownerData.id, currentOwnerId).then((result) => {
                    SweetAlert.swal("Success", 'Owner changed successfully', "success");
                    $scope.inProgress = false;
                    $uibModalInstance.close(result);
                }, (err) => {
                    SweetAlert.swal("Oops...!", err.message, "error");
                    $scope.inProgress = false;
                });
            }
        };

    });