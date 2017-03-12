angular.module('SFA')
    .controller('SubscriptionController', function(SFAPlanService, SweetAlert, $window, $scope, userService, utilsService) {
        let self = this;
        this.step = '';
        this.isVisibleStep = (name) => {
            return self.step === name;
        };
        $scope.inProgress = true;
        userService.subscriptionInfo().then((subscriptionInfo) => {
            $scope.inProgress = false;
            subscriptionInfo.period_end = utilsService.getDateFromMiliseconds(subscriptionInfo.period_end + '000');
            self.currentSubscription = subscriptionInfo;
            self.payWithCurrentCard = !!self.currentSubscription.card;
        });

        function openStep(name) {
            self.step = name;
        }
        this.changeSubscription = () => {
            openStep('change-subscription');
        };

        this.getPrice = (plan, type) => {
            if (plan) {
                return SFAPlanService.getPlanPriceForType(plan, type);
            }
        };

        function subscribePlan(plan, type, card) {
            $scope.inProgress = true;
            userService.selectPlan(plan, type, card).then(() => {
                $window.location = '/';
                $scope.inProgress = false;
            }, (err) => {
                console.log(err);
                SweetAlert.swal("Oops...!", err.message, "error");
                $scope.inProgress = false;
            });
        }

        this.pay = (type, newCard) => {
            if (!newCard) {
                subscribePlan(self.selectedPlan, type, self.cardData);
            } else {
                if (self.cardForm && newCard) {
                    self.cardForm.$setSubmitted();
                    if (self.cardForm.$valid) {
                        subscribePlan(self.selectedPlan, type, self.cardData);
                    }
                }
            }

        };

        this.cancelSubscription = () => {
            if (self.currentSubscription.amount > 0) {
                SweetAlert.swal({
                        title: "Are you sure?",
                        text: "This will cancel your subscription at the end of your billing period on " + self.currentSubscription.period_end + ". You will be able to use SFA normally until then. Please contact support@seekfineart.com if you are having any difficulties with the site.",
                        type: "warning",
                        showCancelButton: true,
                        confirmButtonText: "Yes, cancel it!"
                    },
                    function(isConfirm) {
                        if (isConfirm) {
                            $scope.inProgress = true;
                            userService.cancelSubscription().then(function() {
                                $window.location = '/';
                            }, function(err) {
                                $scope.inProgress = false;
                                SweetAlert.swal("Oops...!", err.message, "error");
                            });
                        }
                    });

            } else {
                SweetAlert.swal("Oops...!", "You can't cancel free plan!", "error");
            }
        };

        this.onPlanSelect = (plan, type) => {
            let price = SFAPlanService.getPlanPriceForType(plan, type);
            if (price && price > 0) {
                self.selectedPlan = plan;
                openStep('payment-selection');
            } else {
                subscribePlan(plan, type);
            }
        };

        this.changeCardDetails = () => {
            self.payWithCurrentCard = false;
        };

    });
