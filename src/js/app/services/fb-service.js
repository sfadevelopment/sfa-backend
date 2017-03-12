angular.module('SFA')
    .service('FacebookService', function locationService($q, userService) {
        var userLocationKey = "SFA-USER-LOCATION";
        return {
            authenticate: () => {
                var deferred = $q.defer();
                FB.login((response) => {
                    if (response.status === 'connected') {
                        userService.saveFBAuthTokens({
                            short_access_token: response.authResponse.accessToken,
                            userID: response.authResponse.userID
                        }).then(() => {
                            deferred.resolve();
                        }, (err) => {
                            deferred.reject(err);
                        });
                    } else if (response.status === 'not_authorized') {
                        deferred.reject("Not authorized");
                    }
                }, { scope: 'manage_pages,publish_pages' });
                return deferred.promise;
            },

            logout: () => {
                let deferred = $q.defer(),
                    removeData = () => {
                        userService.logoutFB().then(() => {
                            deferred.resolve();
                        }, (err) => {
                            deferred.reject(err);
                        });
                    };
                FB.getLoginStatus(function(response) {
                    if (status === 'connected') {
                        FB.logout((response) => {
                            removeData();
                        });
                    } else {
                        removeData();
                    }
                });
                return deferred.promise;
            }
        };
    });
