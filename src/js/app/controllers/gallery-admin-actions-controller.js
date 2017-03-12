angular.module('SFA')
    .controller('GalleryAdminActionsController', function($scope, adminService, $window, SweetAlert, $uibModal) {
        this.galleryId = $window.SFA.gallery_id;
        adminService.getGalleryInfoForEdit(this.galleryId).then((data) => {
            this.galleryData = data;
        }, (err) => {
            SweetAlert.swal("Oops...!", err.message, "error");

        });
        this.changeGalleryStatus = () => {
            $scope.inProgress = true;

            let action = this.galleryData.status === -1 ? 'activate' : 'suspend';
            adminService.chnageGalleryStatus(this.galleryId, action).then((result) => {
                this.galleryData.status = result.status;
                $scope.inProgress = false;
                SweetAlert.swal("Success!", "Gallery status changed", "success");

            }, (err) => {
                SweetAlert.swal("Oops...!", err.message, "error");
                $scope.inProgress = false;
            });
        };

        this.changeGalleryNote = () => {
            $scope.inProgress = true;
            adminService.changeGalleryNote(this.galleryId, this.galleryData.note).then((result) => {
                this.galleryData.status = result.status;
                $scope.inProgress = false;
                SweetAlert.swal("Success!", "Gallery note changed", "success");

            }, (err) => {
                SweetAlert.swal("Oops...!", err.message, "error");
                $scope.inProgress = false;
            });
        };


        this.changeOwner = () => {
            let modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'gallery-change-owner-modal.html',
                controller: 'GalleryChangeOwnerModalController',
                controllerAs: 'ctrl',
                resolve: {
                    galleryId: () => {
                        return this.galleryId;
                    },
                    currentOwnerId: () => {
                        return this.galleryData.subscriber.id;
                    }
                }
            });

            modalInstance.result.then((result) => {
                this.galleryData.subscriber = result;
            });
        };



    });