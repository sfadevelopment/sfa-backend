angular.module('SFA')
    .controller('ChangeArtistNameModalController', function($scope, $uibModalInstance, SweetAlert, artist, artistService) {

        this.close = () => {
            $uibModalInstance.dismiss('cancel');
        };
        this.artistName = artist.name;


        this.onFormSubmit = () => {
            if ($scope.artistForm.$valid) {
                $scope.inProgress = true;
                artistService.updateArtistName(artist.id, this.artistName).then((result) => {
                    SweetAlert.swal("Success", 'Artist updated successfully', "success");
                    $scope.inProgress = false;
                    $uibModalInstance.close(this.artistName);
                }, (err) => {
                    SweetAlert.swal("Oops...!", err.message, "error");
                    $scope.inProgress = false;
                });
            }
        };

    });