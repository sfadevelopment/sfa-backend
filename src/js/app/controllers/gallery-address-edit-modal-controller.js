angular.module('SFA')
    .controller('GalleryAddressEditModalController', function($scope, galleryService, locationService, $uibModalInstance, $timeout, SweetAlert, utilsService, currentAddress) {
        let self = this;

        this.close = () => {
            $uibModalInstance.dismiss('cancel');
        };

        this.hasError = (form, field, validation) => {
            return utilsService.hasError($scope, form, field, validation);
        };

        this.addressData = currentAddress;

        function initPlugins() {
            let poz = [self.addressData.latitude, self.addressData.longitude],
                autocompleteInput = angular.element("#geocomplete"),
                buildAddress = (formattedAddress, addressCoponents) => {
                    const toInclude = ['street_number', 'route'],
                        result = [];
                    addressCoponents.forEach((item) => {
                        let type = item.types[0];
                        if (toInclude.indexOf(type) > -1) {
                            if (formattedAddress.indexOf(item.short_name) > -1) {
                                result[formattedAddress.indexOf(item.short_name)] = item.short_name;
                            } else if (formattedAddress.indexOf(item.long_name) > -1) {
                                result[formattedAddress.indexOf(item.long_name)] = item.long_name;
                            }
                        }
                    });
                    return result.join('');
                };
            autocompleteInput.geocomplete({
                map: ".map_canvas",
                details: ".address_detail",
                location: poz,
                markerOptions: {
                    draggable: true
                },
                mapOptions: {
                    zoom: 16
                }
            });
            autocompleteInput.bind("geocode:dragged", (event, latLng) => {
                self.addressData.latitude = latLng.lat();
                self.addressData.longitude = latLng.lng();
                locationService.getAddressForLatLon(latLng.lat(), latLng.lng(), true).then(
                    (result) => {
                        autocompleteInput.geocomplete("find", result);
                    });
            });
            autocompleteInput.bind("geocode:result", (event, result) => {
                self.addressData.state_id = '';
                self.addressData.country_id = '';
                self.addressData.city_id = '';
                self.addressData.address = result.name || buildAddress(result.formatted_address, result.address_components);
                angular.element("#addressForm").find('input').trigger('input');
            });
        }

        $timeout(initPlugins, 0);
        this.onFormSubmit = () => {
            if ($scope.addressForm.$valid) {

                $scope.inProgress = true;
                galleryService.updateGalleryAddress(self.addressData.id, self.addressData).then(() => {
                    SweetAlert.swal("Success", 'Address updated successfully', "success");
                    $scope.inProgress = false;
                    $uibModalInstance.close(self.addressData);
                }, (err) => {
                    SweetAlert.swal("Oops...!", err.message, "error");
                    $scope.inProgress = false;
                });

            }
        };

    });
