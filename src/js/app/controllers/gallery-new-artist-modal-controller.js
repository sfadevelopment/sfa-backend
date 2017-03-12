angular.module('SFA')
    .controller('GalleryNewArtistModalController', function($scope, $uibModalInstance, SweetAlert, galleryId, artistService, galleryService, messageService) {

        this.close = () => {
            $uibModalInstance.dismiss('cancel');
        };

        this.getArtists = (searchText) => {
            return artistService.getArtistSuggestionByName(searchText).then((response) => {
                return response.artists;
            });
        };

        this.onFormSubmit = () => {
            if ($scope.artistForm.$valid) {
                $scope.inProgress = true;
                let artistData = this.artistData;
                if (!artistData.id) {
                    artistData = {name};
                }
                galleryService.addArtistToGallery(galleryId, artistData).then((result) => {
                    SweetAlert.swal("Success", 'Artist added successfully', "success");
                    $scope.inProgress = false;
                    $uibModalInstance.close(result.artist);
                }, (error) => {
                    $scope.inProgress = false;
                    if (error.type && error.type === "PLAN_LIMIT") {
                        messageService.showUpgarePlanMessage();
                    } else {
                        SweetAlert.swal("Oops...!", error.message, "error");
                    }
                });
            }
        };

    });
