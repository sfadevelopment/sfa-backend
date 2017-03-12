angular.module('SFA')
    .controller('UserHomeController', function($scope, SweetAlert, userService, utilsService, urlService, $window, $uibModal, FacebookService, galleryService) {
        var self = this;
        $scope.inProgress = true;
        userService.userInfo().then((userData) => {
            self.userInfo = userData;
            $scope.inProgress = false;
        }, (err) => {
            SweetAlert.swal("Oops...!", err.message, "error");
            $scope.inProgress = false;
        });


        userService.subscriptionInfo().then((subscriptionInfo) => {
            subscriptionInfo.period_end = utilsService.getDateFromMiliseconds(subscriptionInfo.period_end + '000');
            self.subscriptionInfo = subscriptionInfo;

        });

        this.buildGalleryUrl = (gallery) => {
            return $window.SFA.frontend_url + urlService.buildGalleryUrl(gallery.id, gallery.name);
        };

        this.editProfile = function() {

            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'subscriber-edit-modal.html',
                controller: 'SubscriberEditModalController',
                controllerAs: 'ctrl',
                resolve: {

                    subscriber: () => {
                        /* jshint ignore:start */
                        return {
                            ...self.userInfo
                        }
                        /* jshint ignore:end */
                    }
                }
            });

            modalInstance.result.then((result) => {
                /* jshint ignore:start */
                self.userInfo = {
                        ...self.userInfo,
                        ...result
                    }
                    /* jshint ignore:end */
            });
        };

        this.changePassword = () => {
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'subscriber-change-password-modal.html',
                controller: 'SubscriberChangePasswordModalController',
                controllerAs: 'ctrl'
            });

        };

        this.galleryFacebook = function(gallery) {
            let showFacebookPagesModal = () => {
                this.userInfo.fb_connected = true;
                var modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: 'gallery-facebook-page-selection-modal.html',
                    controller: 'GalleryFacebookPageSelectionModalController',
                    controllerAs: 'ctrl',
                    resolve: {
                        gallery: () => {
                            return gallery;
                        }
                    }
                });

                modalInstance.result.then((result) => {
                    gallery.fb_connected = true;
                });
            };
            if (gallery.fb_connected) {
                SweetAlert.swal({
                        title: "Are you sure?",
                        text: "This will remove Facebook connection for this gallery",
                        type: "warning",
                        showCancelButton: true,
                        confirmButtonText: "Yes, remove it!"
                    },
                    (isConfirm) => {
                        if (isConfirm) {
                            $scope.inProgress = true;
                            galleryService.removeFbPageLinkToGallery(gallery.id).then(() => {
                                SweetAlert.swal("Success!", "Facebook removed", "success");
                                $scope.inProgress = false;
                                gallery.fb_connected = false;
                            }, (err) => {
                                SweetAlert.swal("Oops...!", err.message, "error");
                                $scope.inProgress = false;
                            });
                        }
                    });
            } else {
                FacebookService.authenticate().then(showFacebookPagesModal);
            }
        };

        this.disconnectTwitter = (gallery) => {
            SweetAlert.swal({
                    title: "Are you sure?",
                    text: "This will remove Twitter connection for this gallery",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonText: "Yes, remove it!"
                },
                (isConfirm) => {
                    if (isConfirm) {
                        $scope.inProgress = true;
                        galleryService.removeTwitterLinkToGallery(gallery.id).then(() => {
                            SweetAlert.swal("Success!", "Twitter removed", "success");
                            $scope.inProgress = false;
                            gallery.twitter_connected = false;
                        }, (err) => {
                            SweetAlert.swal("Oops...!", err.message, "error");
                            $scope.inProgress = false;
                        });
                    }
                });
        };

    });
