angular.module('SFA')
    .service('messageService', function galleriesService(SweetAlert, $window) {

        return {
            showUpgarePlanMessage: () => {
                SweetAlert.swal({
                        title: "Oops...!",
                        text: `Looks like you are ready to upgrade! You're currently on a <strong>${$window.SFA.plan.name}</strong>`,
                        type: "warning",
                        showCancelButton: true,
                        cancelButtonText: "Later",
                        confirmButtonText: "Upgrade",
                        html: true
                    },
                    (isConfirm) => {
                        if (isConfirm) {
                            $window.location.href = "/subscription";
                        }
                    });
            }


        };
    });
