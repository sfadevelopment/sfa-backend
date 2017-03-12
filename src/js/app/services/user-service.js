angular.module('SFA')
    .service('userService', function userService(commonService) {
        return {
            signup: (data) => {
                return commonService.post('/api/web/user/signup', data);
            },

            selectPlan: (plan, type, card) => {
                if (card && card.date.indexOf("/") != 2) {
                    var dateParts = card.date.match(/.{1,2}/g);
                    card.date = dateParts[0] + "/" + dateParts[1];
                }
                return commonService.post('/api/web/user/subscribe', {
                    plan: plan.id,
                    type: type,
                    card: card
                });

            },
            subscriptionInfo: () => {
                return commonService.get('/api/web/subscriber/subscription_detail');
            },
            cancelSubscription: () => {
                return commonService.post('/api/web/subscriber/cancel-subscription');
            },

            login: (loginData) => {
                return commonService.post('/api/web/user/login', loginData);
            },
            forgotPassword: (forgotData) => {
                return commonService.post('/api/web/user/forgot-password', forgotData);
            },
            resendVerificationEmail: () => {
                return commonService.post('/resend_verification_email');
            },
            userInfo: () => {
                return commonService.get('/api/web/user/info');
            },
            updateSubscriberInfo: (data) => {
                return commonService.post('/api/web/subscriber/update-subscriber-info', data);
            },
            changeUserPassword: (data) => {
                return commonService.post('/api/web/user/change-password', data);
            },
            saveFBAuthTokens: (data) => {
                return commonService.post('/api/web/user/fb-authentication', data);
            },
            logoutFB: () => {
                return commonService.post('/api/web/user/fb-authentication-remove');
            },

            getFbPages: () => {
                return commonService.get('/api/web/user/fb-pages');
            },

            getSuggestionSuggestionByName: (searchText) => {
                return commonService.get(`/api/web/subscriber/suggestions-by-name?searchText=${searchText}`);
            }

        };
    });
