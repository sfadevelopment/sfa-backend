angular.module('SFA')
    .directive('artworkForm', function($locale, styleService, SFA_AVAILABLE_CURRENCIES, SFA_ARTWORK_SIZE_UNITS) {

        return {
            templateUrl: 'artwork-form.html',
            controllerAs: 'ctrl',
            transclude: true,
            scope: {
                form: '=',
                artworkData: '=',
                galleryId: '@',
                galleryHasFacebook: '@',
                galleryHasTwitter: '@',
                artistId: '@',
                afterSave: '&',
                onCancel: '&'
            },
            link: (scope, element, attrs, controller) => {
                styleService.getStyles().then((result) => {
                    controller.styles = result;
                });
            },
            controller: function($scope, galleryService, SweetAlert, parseService, utilsService, messageService) {
                this.availableCurrencies = SFA_AVAILABLE_CURRENCIES;
                this.availableUnits = SFA_ARTWORK_SIZE_UNITS;

                if (!$scope.artworkData) {
                    $scope.artworkData = {};
                }

                if (!$scope.artworkData.currency) {
                    $scope.artworkData.currency = 'USD';
                }
                if ($scope.artworkData.price !== '-2' && $scope.artworkData.price !== '-1') {
                    $scope.artworkData.priceDisplay = Number($scope.artworkData.price);
                    $scope.artworkData.price = '-3';
                }

                this.fixPriceValue = () => {
                    if ($scope.artworkData.price === '-3') {
                        $scope.artworkData.price = $scope.artworkData.priceDisplay;
                    }
                };

                this.closeSelected = () => {
                    this.fixPriceValue();
                    $scope.artworkForm.$setPristine();
                    this.setDefaults();

                    if ($scope.onCancel()) {
                        let cb = $scope.onCancel();
                        cb();
                    }
                };
                this.afterSaveCb = (result) => {
                    this.setDefaults();

                    if ($scope.afterSave()) {
                        let cb = $scope.afterSave();
                        cb(result);
                    }
                };
                this.hasError = (form, field, validation) => {

                    return utilsService.hasError($scope, form, field, validation);
                };

                this.isFacebookShareAvailable = () => {
                    return JSON.parse($scope.galleryHasFacebook);
                };

                this.isTwitterShareAvailable = () => {
                    return JSON.parse($scope.galleryHasTwitter);
                };

                this.setDefaults = () => {
                    if (this.isFacebookShareAvailable() && !$scope.artworkData.id) {
                        $scope.artworkData.postToFacebook = true;
                    }
                    if (this.isTwitterShareAvailable() && !$scope.artworkData.id) {
                        $scope.artworkData.postToTwitter = true;
                    }
                    if (!$scope.artworkData.dimensions_unit) {
                        $scope.artworkData.dimensions_unit = 'in';

                    }
                };
                this.setDefaults();

                this.isSocialShareVisible = () => {
                    return !$scope.artworkData.id && (this.isFacebookShareAvailable() || this.isTwitterShareAvailable());
                };

                this.onFormSubmit = () => {
                    if ($scope.artworkForm.$valid) {
                        this.fixPriceValue();
                        $scope.inProgress = true;

                        let saveArtwork = () => {
                            $scope.artworkData.artistId = $scope.artistId;
                            /* jshint ignore:start */
                            let artworkData = {
                                ...$scope.artworkData
                            };
                            /* jshint ignore:end */

                            artworkData.original_image_link = null;
                            galleryService.updateGalleryArtwork($scope.galleryId, artworkData).then((result) => {
                                SweetAlert.swal("Success", 'Artwork updated successfully', "success");
                                $scope.inProgress = false;
                                if ($scope.afterSave) {
                                    this.afterSaveCb(result.artwork);
                                }
                                $scope.artworkForm.$setPristine();
                            }, (error) => {
                                $scope.inProgress = false;
                                if (error.type && error.type === "PLAN_LIMIT") {
                                    messageService.showUpgarePlanMessage();
                                } else {
                                    SweetAlert.swal("Oops...!", error.message, "error");
                                }
                            });
                        };
                        if ($scope.artworkData.file) {
                            let file = $scope.artworkData.file,
                                filename = parseService.buildFileName(file.name);
                            parseService.uploadFile(filename, file).then((uploadedFile) => {
                                $scope.artworkData.file_url = uploadedFile._url;
                                $scope.artworkData.filename = filename;
                                saveArtwork();
                            }, (error) => {
                                $scope.inProgress = false;
                                SweetAlert.swal("Oops...!", error.message, "error");
                            });
                        } else {
                            saveArtwork();
                        }
                    }
                };
            }
        };
    });
