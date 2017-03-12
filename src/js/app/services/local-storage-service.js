angular.module('SFA')
    .service('localStorageService', function locationService($localStorage) {
        var userLocationKey = "SFA-USER-LOCATION";
        return {
            getUserLocation: () => {
                return $localStorage[userLocationKey] || null;
            },

            updateUserLocation: (newLocation) => {
                $localStorage[userLocationKey] = newLocation;
            }
        };
    });
