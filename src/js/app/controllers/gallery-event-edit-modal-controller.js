angular.module('SFA')
    .controller('GalleryEventEditModalController', function($scope, $uibModalInstance, SweetAlert, galleryId, utilsService, galleryName, event, galleryService, parseService, messageService) {

        this.close = () => {
            $uibModalInstance.dismiss('cancel');
        };
        this.galleryName = galleryName;

        event.start_date = event.start_date ? new Date(event.start_date) : null;
        event.end_date = event.end_date ? new Date(event.end_date) : null;
        this.eventData = event;
        this.format = 'MM/dd/yyyy';
        this.hasError = (form, field, validation) => {
            return utilsService.hasError($scope, form, field, validation);
        };

        this.onFormSubmit = () => {
            if ($scope.eventForm.$valid) {
                $scope.inProgress = true;

                let saveEventData = () => {
                    galleryService.updateGalleryEvent(galleryId, this.eventData).then((result) => {
                        SweetAlert.swal("Success", 'Event updated successfully', "success");
                        $scope.inProgress = false;
                        $uibModalInstance.close(result.events);
                    }, (error) => {
                        $scope.inProgress = false;
                        if (error.type && error.type === "PLAN_LIMIT") {
                            messageService.showUpgarePlanMessage();
                        } else {
                            SweetAlert.swal("Oops...!", error.message, "error");
                        }
                    });

                };

                if (this.selectedFile) {
                    let filename = parseService.buildFileName(this.selectedFile.name);
                    parseService.uploadFile(filename, this.selectedFile).then((uploadedFile) => {
                        this.eventData.file_url = uploadedFile._url;
                        this.eventData.filename = filename;
                        saveEventData();
                    }, (error) => {
                        $scope.inProgress = false;
                        SweetAlert.swal("Oops...!", error.message, "error");
                    });
                } else {
                    saveEventData();
                }
            }
        };

        this.fileChanged = () => {
            let file = this.selectedFile;
            if (this.selectedFile) {
                this.selectedFileName = this.selectedFile.name;
                if (this.eventData.id) {
                    let reader = new FileReader();
                    reader.onload = (readerEvt) => {
                        let binaryString = readerEvt.target.result,
                            base64file = btoa(binaryString);
                        $scope.$apply(() => {
                            this.eventData.image = 'data:image/png;base64,' + base64file;
                        });
                    };
                    reader.readAsBinaryString(this.selectedFile);
                }
            }
        };

        this.selectFile = () => {
            angular.element('#event-file-input').click();
        };

    });
