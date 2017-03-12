angular.module('SFA')
    .service('locationService', function locationService($q, $http, SFA_DEFAULT_CORDS, localStorageService) {
        var getAddressForLatLon = function(lat, lon, returnFormattedAddress=false) {
                var deferred = $q.defer(),
                    url = "https://maps.google.com/maps/api/geocode/json?latlng=" + lat + "," + lon + "&sensor=false";
                $http({
                    method: 'GET',
                    url: url
                }).then(function successCallback(response) {
                    if(returnFormattedAddress){
                        deferred.resolve(response.data.results[0].formatted_address);
                        return;
                    }
                    var city = '',
                        state = '',
                        country = '';
                    $.each(response.data.results[0].address_components, function(i, a) {
                        if (a.types[0] === "administrative_area_level_1") {
                            state = a.short_name;
                        }

                        if (a.types[0] === "locality") {
                            city = a.long_name;
                        }

                        if (a.types[0] === "country") {
                            country = a.long_name;
                        }
                    });
                    var addr = (city !== '') ? city + ", " : '';
                    addr += (state !== '') ? state + ", " : '';
                    deferred.resolve(addr + country);
                }, function errorCallback(response) {
                    deferred.reject(response);
                });
                return deferred.promise;
            },
            getSFLocation = function() {
                var SF_lat = SFA_DEFAULT_CORDS.lat,
                    SF_lon = SFA_DEFAULT_CORDS.lon;
                return getAddressForLatLon(SF_lat, SF_lon).then(function(address) {
                    $q.resolve({
                        address: address,
                        lat: SF_lat,
                        lon: SF_lon
                    });
                });
            },
            getLocationFromNavigator = function() {
                var deferred = $q.defer();
                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(function(position) {
                        var usersLat = position.coords.latitude,
                            usersLon = position.coords.longitude;
                        getAddressForLatLon(usersLat, usersLon).then(function(address) {
                            deferred.resolve({
                                address: address,
                                lat: usersLat,
                                lon: usersLon
                            });
                        }).catch(function(err) {
                            deferred.reject(err);
                        });
                    }, function(error) {
                        switch (error.code) {
                            case error.PERMISSION_DENIED:
                                console.log("User denied the request for Geolocation.");
                                break;
                            case error.POSITION_UNAVAILABLE:
                                alert("Location information is unavailable.");
                                console.log("Set default location to SF.  err.unavailable");
                                break;
                            case error.TIMEOUT:
                                alert("The request to get user location timed out.");
                                console.log("Set default location to SF.  err.timeout");
                                break;
                            case error.UNKNOWN_ERROR:
                                alert("An unknown error occurred.");
                                console.log("Set default location to SF. err.unknown");
                                break;
                        }
                        getPositionByIP().then(function(data) {
                            deferred.resolve(data);
                        }).catch(function() {
                            getSFLocation().then(function(data) {
                                deferred.resolve(data);
                            }).catch(function() {
                                deferred.reject(err);
                            });

                        });
                    });
                } else {
                    deferred.reject("Geolocation is not supported by this browser.");
                }
                return deferred.promise;
            },
            getPositionByIP = function() {
                var deferred = $q.defer();
                $http({
                    method: 'JSONP',
                    url: 'https://freegeoip.net/json/?callback=JSON_CALLBACK'
                }).then(function successCallback(response) {
                    getAddressForLatLon(response.data.latitude, response.data.longitude).then(function(address) {
                        deferred.resolve({
                            address: address,
                            lat: response.data.latitude,
                            lon: response.data.longitude
                        });
                    }).catch(function(err) {
                        deferred.reject(err);
                    });
                }, function errorCallback(response) {
                    deferred.reject(response);
                });
                return deferred.promise;
            };
        return {
            getUserLocation: function() {
                if (!localStorageService.getUserLocation()) {
                    return getLocationFromNavigator().then(function(result) {
                        localStorageService.updateUserLocation(result);
                        return $q.resolve(result);
                    });
                } else {
                    return $q.resolve(localStorageService.getUserLocation());
                }
            },
            updateUserLocation: function(address, lat, lon) {
                localStorageService.updateUserLocation({
                    address: address,
                    lat: lat,
                    lon: lon
                });
            },
            getAddressForLatLon: getAddressForLatLon
        };
    });
