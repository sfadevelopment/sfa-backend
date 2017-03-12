angular.module('SFA')
    .directive('artworkUpload', function($locale, styleService) {

        return {
            templateUrl: 'artwork-upload.html',
            controllerAs: 'ctrl',
            scope: {
                artworkList: '=',
                galleryId: '@',
                afterSave: '&',
                artistId: '@',
                onCancel: '&',
                galleryHasFacebook: '@',
                galleryHasTwitter: '@',
                filesToUpload: '=',
                displayLoadDialog: '=',
                onEditStart: '&'

            },
            link: (scope, element, attrs, controller) => {},
            controller: function($scope, galleryService, SweetAlert, SFA_MESSAGES) {
                const prerenderImage = (artwork, file) => {
                    let reader = new FileReader();
                    reader.onload = (readerEvt) => {
                        let binaryString = readerEvt.target.result,
                            base64file = btoa(binaryString);
                        $scope.$apply(() => {
                            artwork.original_image_link = 'data:image/png;base64,' + base64file;
                        });
                    };
                    reader.readAsBinaryString(file);
                };
                this.galleryId = $scope.galleryId;
                this.artistId = $scope.artistId;

                this.availableArtworks = [];
                this.selectFiles = () => {
                    angular.element('#arwork-input').click();
                };


                this.afterArtworkSave = (artwork) => {
                    $scope.artworkList.push(artwork);
                    this.availableArtworks.shift();
                    this.displayArtworkForEdit();
                };

                this.afterArtworkCancel = () => {
                    this.editableArtwork = null;
                    this.availableArtworks.shift();
                    this.displayArtworkForEdit();
                };

                this.displayArtworkForEdit = () => {
                    if ($scope.onEditStart()) {
                        $scope.onEditStart()();
                    }
                    if (this.availableArtworks.length) {
                        this.editableArtwork = this.availableArtworks[0];
                    } else {
                        this.editableArtwork = null;
                        this.hideUpload();
                    }
                };

                $scope.$watch('filesToUpload', () => {
                    if ($scope.filesToUpload.length) {
                        this.selectedFiles = $scope.filesToUpload;
                        this.artworksFileChanged();
                        $scope.filesToUpload = [];
                    }

                });
                $scope.$watch('displayLoadDialog', () => {
                    if ($scope.displayLoadDialog) {
                        this.selectFiles();
                    }
                    $scope.displayLoadDialog = false;
                });


                this.artworksFileChanged = () => {
                    let tooBigFiles = false;
                    for (let i = 0; i < this.selectedFiles.length; i++) {
                        let file = this.selectedFiles.item ? this.selectedFiles.item(i) : this.selectedFiles[i],
                            artworkObj = {
                                file
                            };
                        if (file.size > 2097152) {
                            tooBigFiles = true;
                            continue;
                        }
                        prerenderImage(artworkObj, file);
                        this.availableArtworks.push(artworkObj);
                    }

                    if (tooBigFiles) {
                        SweetAlert.swal("Warning", SFA_MESSAGES.file_too_big, "warning");
                    }
                    this.displayArtworkForEdit();
                };

                this.hideUpload = () => {
                    if ($scope.onCancel()) {
                        let cb = $scope.onCancel();
                        cb();
                    }
                };
            }
        };
    });
