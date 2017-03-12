angular.module('SFA')
    .controller('GalleryOpeningHoursModalController', function($scope, utilsService, galleryService, $uibModalInstance, SweetAlert, galleryId, currentOpeningHours) {
        this.editingHours = false;
        this.close = () => {
            $uibModalInstance.dismiss('cancel');
        };

        this.currentOpeningHours = currentOpeningHours;
        this.getHourDisplay = (day, type) => {
            let opening = this.currentOpeningHours[`${day}_opening`],
                closing = this.currentOpeningHours[`${day}_closing`];
            if (opening === '') {
                return 'Closed';
            } else if (opening === 'BA') {
                return 'By appointment';
            } else {
                return `${opening} - ${closing}`;
            }
        };
        this.editHours = () => {
            this.editingHours = true;
        };
        // this.sugestionsLimit = 100;
        this.dayKeys = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
        this.onHoutInputCancel = () => {
            this.editingHours = false;
        };
        this.onHoutInputChange = (result) => {
            this.editingHours = false;
            /* jshint ignore:start */
            this.currentOpeningHours = {
                ...this.currentOpeningHours,
                ...result
            };
            this.changedHours = true;
            /* jshint ignore:end */
            console.log(this.currentOpeningHours);
        };
        this.onFormSubmit = () => {
            $scope.inProgress = true;
            let dataToSave = this.currentOpeningHours;
            galleryService.changeGalleryOpening(galleryId, dataToSave).then((result) => {
                SweetAlert.swal("Success", 'Openings updated successfully', "success");
                $scope.inProgress = false;
                $uibModalInstance.close(dataToSave);
            }, (err) => {
                SweetAlert.swal("Oops...!", err.message, "error");
                $scope.inProgress = false;
            });


        };

    });
