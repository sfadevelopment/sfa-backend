angular.module('SFA')
    .controller('GalleryBannersEditModalController', function($scope, $q, $uibModalInstance, galleryId, fileService, SweetAlert, banners, availableCount, parseService, galleryService, SFA_MESSAGES) {
        this.banners = [];
        this.countChanged = false;
        angular.copy(banners, this.banners);

        let uploadFile = (file, multiple = false) => {
            if (file) {
                if (!fileService.isFileSizeValid(file.size)) {
                    SweetAlert.swal("Oops...!", SFA_MESSAGES.file_too_big, "error");
                    $q.reject();
                    return false;
                }
                let filename = parseService.buildFileName(file.name);
                $scope.inProgress = true;
                return parseService.uploadFile(filename, file).then((uploadedFile) => {
                    return galleryService.uploadGalleryBanner(galleryId, {
                        file_url: uploadedFile._url,
                        filename: filename,
                        target: this.banners.length === 0 ? 'main' : ''
                    }).then(() => {
                        this.banners.push({
                            url: uploadedFile._url,
                            name: filename
                        });
                        if (!multiple) {
                            $scope.inProgress = false;
                        }
                        this.countChanged = true;
                    }, (error) => {
                        if (!multiple) {
                            $scope.inProgress = false;
                        }
                        this.selectedFile = {};
                        SweetAlert.swal("Oops...!", error.message, "error");
                    });
                }, (error) => {
                    if (!multiple) {
                        $scope.inProgress = false;
                    }
                    this.selectedFile = {};
                    SweetAlert.swal("Oops...!", error.message, "error");
                });

            }
        };

        this.isNewBannerAvailable = () => {
            return this.banners.length < availableCount;
        };

        this.uploadBanner = () => {
            angular.element('#banner-input').click();
        };
        this.uploadFilesOnDrop = (files) => {
            if (files.length) {
                let uploads = [];
                $scope.inProgress = true;
                files.forEach((file) => {
                    uploads.push(uploadFile(file, true));
                });
                $q.all(uploads).then(() => { $scope.inProgress = false; }, () => { $scope.inProgress = false; });
            }

        };

        this.bannerChanged = () => {
            uploadFile(this.selectedFile);
        };

        this.hasChanged = () => {
            return !angular.equals(this.banners, banners);
        };

        this.save = () => {
            $scope.inProgress = true;
            galleryService.updateBanners(galleryId, this.banners).then(() => {
                SweetAlert.swal("Success", 'Banners updated successfully', "success");
                $scope.inProgress = false;
                $uibModalInstance.close(this.banners);
            }, (error) => {
                $scope.inProgress = false;
                SweetAlert.swal("Oops...!", error.message, "error");
            });
        };

        this.close = () => {
            if (this.countChanged) {
                $uibModalInstance.close(this.banners);
            } else {
                $uibModalInstance.dismiss('cancel');
            }
        };

        this.removeBanner = (banner) => {
            SweetAlert.swal({
                    title: "Are you sure?",
                    text: "This will remove banner from your gallery",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonText: "Yes, remove it!"
                },
                (isConfirm) => {
                    if (isConfirm) {
                        $scope.inProgress = true;

                        galleryService.removeBanner(galleryId, { target: 'other', fileUrl: banner.url }).then(() => {
                            SweetAlert.swal("Success", 'Banner removed successfully', "success");
                            $scope.inProgress = false;
                            let index = this.banners.indexOf(banner);
                            this.banners.splice(index, 1);
                            this.countChanged = true;
                        }, (error) => {
                            $scope.inProgress = false;
                            SweetAlert.swal("Oops...!", error.message, "error");
                        });
                    }
                });
        };


    });
