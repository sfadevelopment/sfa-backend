angular.module('SFA')
    .controller('GalleryArtistEditModalController', function($scope, $uibModalInstance, galleryId, artist, SweetAlert, galleryService, galleryHasFacebook, galleryHasTwitter) {

        this.initialArtworksLength = artist.artworks.length;
        this.collectionChanged = false;
        this.selected = null;
        this.artist = {};
        angular.copy(artist, this.artist);
        this.selectedFiles = [];
        this.onItemSelect = (item, $index) => {
            /* jshint ignore:start */
            this.selected = {
                ...item
            };
            /* jshint ignore:end */
            this.editing = true;
            this.editableItemIndex = $index;
        };
        this.closeSelected = () => {
            this.selected = {};
            this.editing = false;
        };

        this.isSelected = (item) => {
            return this.selected && this.selected.id === item.id;
        };

        this.uploadFilesOnDrop = (files) => {
            this.uploadInProgress = true;
            this.selectedFiles = files;
        };

        this.galleryId = galleryId;
        this.galleryHasFacebook = galleryHasFacebook;
        this.galleryHasTwitter = galleryHasTwitter;
        this.artistId = artist.id;
        this.afterArtworkSave = (savedArtwork) => {
            this.selected = null;
            this.collectionChanged = true;
            this.editing = false;
            this.artist.artworks[this.editableItemIndex] = savedArtwork;
        };

        this.save = () => {
            $scope.inProgress = true;
            galleryService.updateArtistArtworks(galleryId, this.artist.id, this.artist.artworks).then(() => {
                SweetAlert.swal("Success", 'Artworks updated successfully', "success");
                $scope.inProgress = false;
                this.collectionChanged = true;
                this.close();

            }, (error) => {
                $scope.inProgress = false;
                SweetAlert.swal("Oops...!", error.message, "error");
            });
        };


        this.hasChanged = () => {
            return !angular.equals(this.artist, artist);
        };

        this.close = () => {
            if (this.collectionChanged) {
                $uibModalInstance.close(this.artist);
            } else {
                $uibModalInstance.dismiss('cancel');
            }
        };

        this.removeArtwork = (artwork, $event) => {
            $event.stopPropagation();
            SweetAlert.swal({
                    title: "Are you sure?",
                    text: "This will remove artwork from your gallery",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonText: "Yes, remove it!"
                },
                (isConfirm) => {
                    if (isConfirm) {
                        $scope.inProgress = true;
                        galleryService.removeArtworkFromGallery(galleryId, artwork.id).then(() => {
                            SweetAlert.swal("Success", 'Artwork removed successfully', "success");
                            $scope.inProgress = false;
                            let index = this.artist.artworks.indexOf(artwork);
                            this.artist.artworks.splice(index, 1);
                            this.collectionChanged = true;
                        }, (error) => {
                            $scope.inProgress = false;
                            SweetAlert.swal("Oops...!", error.message, "error");
                        });
                    }
                });
        };
        this.onEditStart = () => {
            this.uploadInProgress = true;

        };

        this.uploadMore = () => {
            this.displayLoadDialog = true;
        };
        this.onCacelUpload = () => {
            this.uploadInProgress = false;
            if (this.artist.artworks.length != this.initialArtworksLength) {
                this.collectionChanged = true;
            }
        };
    });
