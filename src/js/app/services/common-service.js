angular.module('SFA')
    .service('commonService', function($http, $q) {
        var baseCall = function(method, url, object) {
            var deferred = $q.defer();
            var httpCall = null;
            if (angular.isUndefined(object)) {
                httpCall = $http[method](url);
            } else {
                httpCall = $http[method](url, object);
            }

            httpCall.success(function(data) {
                successHttpCall(data, deferred);
            }).error(function(error) {
                failureHttpCall(error, deferred);
            });

            return deferred.promise;
        };

        var successHttpCall = function(data, deferred) {
            deferred.resolve(data);
        };

        var failureHttpCall = function(error, deferred) {
            deferred.reject(error);
        };

        this.post = function(url, object) {
            return baseCall('post', url, object);
        };

        this.get = function(url, object) {
            return baseCall('get', url, object);
        };

        this.delete = function(url, object) {
            return baseCall('delete', url, object);
        };

        this.put = function(url, object) {
            return baseCall('put', url, object);
        };
    });
