angular.module('SFA')
    .controller('GalleryFacebookPageSelectionModalController', function($scope, $uibModalInstance, utilsService, userService, SweetAlert, gallery, galleryService) {

        this.close = () => {
            $uibModalInstance.dismiss('cancel');
        };
        this.galleryName = gallery.name;
        $scope.inProgress = true;

        userService.getFbPages().then((result) => {
            this.pages = result;
            $scope.inProgress = false;
        }, (err) => {
            SweetAlert.swal("Oops...!", err.message, "error");
            $scope.inProgress = false;
            this.close();
        });


        this.selectPage = (page) => {
            $scope.inProgress = true;
            galleryService.saveFbPageLinkToGallery(gallery.id, page.id).then((result) => {
                $scope.inProgress = false;
                SweetAlert.swal("Success", 'Facebook linked successfully!!!', "success");
                $uibModalInstance.close();

            }, (err) => {
                SweetAlert.swal("Oops...!", err.message, "error");
                $scope.inProgress = false;
            });
        };
        // this.hasError = (form, field, validation) => {
        //     return utilsService.hasError($scope, form, field, validation);
        // };

        // this.onFormSubmit = () => {
        //     if ($scope.passwordForm.$valid) {
        //         $scope.inProgress = true;
        //         userService.changeUserPassword(this.passwordData).then(function() {
        //             SweetAlert.swal("Success", 'Password updated successfully', "success");
        //             $scope.inProgress = false;
        //             $uibModalInstance.dismiss('cancel');

        //         }, function(err) {
        //             SweetAlert.swal("Oops...!", err.message, "error");
        //             $scope.inProgress = false;
        //         });

        //     }
        // };

    });
