angular.module('SFA')
    .service('utilsService', function utilsService($window) {

        return {
            calculateDistance: (lat1, lon1, lat2, lon2, unit) => {
                var radlat1 = Math.PI * Number(lat1) / 180;
                var radlat2 = Math.PI * Number(lat2) / 180;
                var radlon1 = Math.PI * Number(lon1 / 180);
                var radlon2 = Math.PI * Number(lon2 / 180);
                var theta = lon1 - lon2;
                var radtheta = Math.PI * theta / 180;
                var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
                dist = Math.acos(dist);
                dist = dist * 180 / Math.PI;
                dist = dist * 60 * 1.1515;
                if (unit == "K") {
                    dist = dist * 1.609344;
                }
                if (unit == "N") {
                    dist = dist * 0.8684;
                }

                dist = +dist.toFixed(2);
                return dist;
            },
            slug: (str) => {
                str = str.replace(/^\s+|\s+$/g, ''); // trim
                str = str.toLowerCase();

                // remove accents, swap ñ for n, etc
                var from = "ãàáäâẽèéëêìíïîõòóöôùúüûñç·/_,:;";
                var to = "aaaaaeeeeeiiiiooooouuuunc------";
                for (var i = 0, l = from.length; i < l; i++) {
                    str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
                }

                str = str.replace(/[^a-z0-9 -]/g, '') // remove invalid chars
                    .replace(/\s+/g, '-') // collapse whitespace and replace by -
                    .replace(/-+/g, '-'); // collapse dashes

                return str;
            },
            getParameterByName: (name, url) => {
                if (!url) url = $window.location.href;
                name = name.replace(/[\[\]]/g, "\\$&");
                var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
                    results = regex.exec(url);
                if (!results) return null;
                if (!results[2]) return '';
                return decodeURIComponent(results[2].replace(/\+/g, " "));
            },
            getRequestParams: () => {
                return $window.location.href.slice($window.location.href.indexOf('?') + 1).split("&");

            },
            getDimensions: (height, width, depth) => {
                var dimension = "";
                if (height !== 0 || width !== 0) {
                    dimension += height + "\" x " + width + "\"";
                }
                if (depth !== 0) {
                    dimension += " x " + depth + "\"";
                }
                return dimension;
            },
            getCorrectUrl: (url) => {
                return url.indexOf("http:") != -1 ? url : "http://" + url;
            },

            calculatePrice: (a) => {
                return (a == -2 || a === 'Call For Price') ? 'Call For Price' : (a == -1 ? 'SOLD' : (a === 0) ? '' : '$' + a);
            },

            hasError: ($scope, form, field, validation) => {
                if (form && $scope[form][field]) {
                    if (validation) {
                        return ($scope[form][field].$dirty && $scope[form][field].$error[validation]) || ($scope[form].$submitted && $scope[form][field].$error[validation]);
                    }
                    return ($scope[form][field].$dirty && $scope[form][field].$invalid) || ($scope[form].$submitted && $scope[form][field].$invalid);
                } else {
                    return false;
                }
            },
            getDateFromMiliseconds: (dateString) => {
                let month = [];
                month[0] = "January";
                month[1] = "February";
                month[2] = "March";
                month[3] = "April";
                month[4] = "May";
                month[5] = "June";
                month[6] = "July";
                month[7] = "August";
                month[8] = "September";
                month[9] = "October";
                month[10] = "November";
                month[11] = "December";

                var date = new Date(Number(dateString));
                return month[date.getMonth()] + " " + date.getDate() + ", " + date.getFullYear();
            },

            getDayRepresentation: (day) => {
                let days = [];
                days[1] = "Monday";
                days[2] = "Tuesday";
                days[4] = "Wednesday";
                days[5] = "Thursday";
                days[6] = "Friday";
                days[7] = "Saturday";
                days[7] = "Sunday";
                return days[day];
            }
        };
    });