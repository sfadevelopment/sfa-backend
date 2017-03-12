angular.module('SFA')
    .directive('googleAutocompleate', function() {
        var componentForm = {
                street_number: 'short_name',
                route: 'long_name',
                locality: 'long_name',
                administrative_area_level_1: 'short_name',
                country: 'long_name',
                postal_code: 'short_name'
            },
            mapping = {
                street_number: 'number',
                route: 'street',
                locality: 'city',
                administrative_area_level_1: 'state',
                country: 'country',
                postal_code: 'zip'
            };

        return {
            require: 'ngModel',
            scope: {
                ngModel: '=',
                details: '=?'
            },
            link: function(scope, element, attrs, model) {
                let options = {
                    types: [],
                    componentRestrictions: {}
                };
                scope.gPlace = new google.maps.places.Autocomplete(element[0], options);

                google.maps.event.addListener(scope.gPlace, 'place_changed', function() {

                    let place = scope.gPlace.getPlace();

                    let details = place.geometry && place.geometry.location ? {
                        latitude: place.geometry.location.lat(),
                        longitude: place.geometry.location.lng()
                    } : {};

                    // Get each component of the address from the place details
                    // and fill the corresponding field on the form.
                    for (let i = 0; i < place.address_components.length; i++) {
                        let addressType = place.address_components[i].types[0];
                        if (componentForm[addressType]) {
                            let val = place.address_components[i][componentForm[addressType]];
                            details[mapping[addressType]] = val;
                        }
                    }
                    details.formatted = place.formatted_address;
                    details.placeId = place.place_id;
                    scope.$apply(() => {
                        scope.details = details; // array containing each location component
                        model.$setViewValue(element.val());
                    });
                });
            }
        };
    });
