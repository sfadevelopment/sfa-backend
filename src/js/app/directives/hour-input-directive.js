angular.module('SFA')
    .directive('hourInput', function($locale, utilsService, SweetAlert) {

        return {
            templateUrl: 'hour-input.html',
            scope: {
                onCancel: '&',
                onChange: '&'
            },
            link: function($scope, element, attrs, model) {
                $scope.hourInput = {};

                function getNumberDisplayForDate(number) {
                    if (number < 10) {
                        return '0' + number;
                    }
                    return number;
                }

                function generateHours(availableHours, eveningFirst = false) {
                    let result = [],
                        availableminutes = [0, 10, 20, 30, 40, 50];
                    availableHours.forEach(function(hour) {
                        availableminutes.forEach((minute) => {
                            let hourDisplay = `${getNumberDisplayForDate(hour)}:${getNumberDisplayForDate(minute)}`;
                            if (eveningFirst) {
                                result.push(`${hourDisplay} PM`);
                            }
                            if (hour !== 12) {
                                result.push(`${hourDisplay} AM`);
                            }
                            if (!eveningFirst) {
                                result.push(`${hourDisplay} PM`);
                            }
                        });
                    });
                    return result;
                }

                $scope.availableHours = [];
                let availableStartHours = [9, 10, 11, 12, 1, 2, 3, 4, 5, 6, 7, 8],
                    availableEndHours = [5, 6, 7, 8, 9, 10, 11, 12, 1, 2, 3, 4];

                $scope.availableOpeningHours = generateHours(availableStartHours);
                $scope.availableClosingHours = generateHours(availableEndHours, true);
                $scope.hasError = (form, field, validation) => {
                    return utilsService.hasError($scope, form, field, validation);
                };
                $scope.selectedDays = [];
                $scope.dayKeys = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
                $scope.syncCheckboxes = (bool, day) => {
                    if (bool) {
                        $scope.selectedDays.push(day);
                    } else {
                        $scope.selectedDays.splice($scope.selectedDays.indexOf(day), 1);
                    }
                };

                $scope.isChecked = (day) => {
                    var match = false;
                    if ($scope.selectedDays.indexOf(day) > -1) {
                        match = true;
                    }
                    return match;
                };

                $scope.cancel = () => {
                    if ($scope.onCancel()) {
                        let cb = $scope.onCancel()();
                    }
                };
                $scope.onFormSubmit = () => {
                    if ($scope.selectedDays.length === 0) {
                        SweetAlert.swal("Oops...!", 'Select days for opening hours', "warning");
                        return;
                    }
                    if ($scope.hourInputForm.$valid) {
                        let result = {},
                            opening = '',
                            closing = '';
                        if ($scope.hourInput.byAppointment) {
                            opening = 'BA';
                        } else if (!$scope.hourInput.closed) {
                            opening = $scope.hourInput.from;
                            closing = $scope.hourInput.to || '';
                        }
                        $scope.selectedDays.forEach((day) => {
                            result[`${day}_opening`] = opening;
                            result[`${day}_closing`] = closing;
                        });
                        if ($scope.onChange()) {
                            let cb = $scope.onChange()(result);
                        }
                    }
                };
            }
        };
    });
