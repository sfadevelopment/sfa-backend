angular.module('SFA')
    .controller('SignupController', function($scope, SweetAlert, SFAPlanService, userService, utilsService, $window) {
        let self = this;
        this.currentStep = 'gallery-selection';
        //this.currentStep = 'plan-selection';
        $scope.inProgress = false;
        self.signupData = {
            gallery: {},
            user: {}
        };
        self.subscriptionData = {
            plan: {},
            planType: '',
            card: {}
        };

        this.addNewGallery = function() {
            openStep('user-data');
        };


        $scope.startProgress = function() {
            $scope.inProgress = true;
        };

        $scope.stopProgress = function() {
            $scope.inProgress = false;
        };

        function openStep(stemName) {
            self.currentStep = stemName;
        }
        this.isActiveStep = function(stepName) {
            return self.currentStep === stepName;
        };

        this.selectGallery = function(gallery) {
            if (!(gallery.subscriber && gallery.subscriber.id)) {
                self.signupData.gallery = gallery;
                openStep('user-data');
            } else {
                SweetAlert.swal("Oops...!", 'This gallery is claimed by ' + gallery.subscriber.name, "warning");
            }
        };

        this.onAccountSubmit = function() {
            if ($scope.accountForm.$valid) {
                $scope.startProgress();
                userService.signup(self.signupData).then(function() {
                    openStep('plan-selection');
                    $scope.stopProgress();
                }, function(err) {
                    SweetAlert.swal("Oops...!", err.message, "error");
                    $scope.stopProgress();

                });
            }
        };

        function subscribePlan(plan, type, card) {
            $scope.startProgress();
            userService.selectPlan(plan, type, card).then(function() {
                $window.location = '/';
                $scope.stopProgress();
            }, function(err) {
                console.log(err);
                SweetAlert.swal("Oops...!", err.message, "error");
                $scope.stopProgress();
            });
        }

        this.onPlanSelect = function(plan, type) {
            let price = SFAPlanService.getPlanPriceForType(plan, type);

            if (price && price > 0) {
                openStep('card-data');
                self.subscriptionData.plan = plan;
            } else {
                subscribePlan(plan, type);
            }
        };

        this.getPrice = function(plan, type) {
            return SFAPlanService.getPlanPriceForType(plan, type);
        };

        this.pay = function(type) {
            if (self.cardForm) {
                self.cardForm.$setSubmitted();
                if (self.cardForm.$valid) {
                    subscribePlan(self.subscriptionData.plan, type, self.subscriptionData.cardData);
                }
            }

        };

        this.hasError = (form, field, validation) => {
            return utilsService.hasError($scope, form, field, validation);
        };
    });
