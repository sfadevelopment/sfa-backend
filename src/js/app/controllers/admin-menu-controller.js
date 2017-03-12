angular.module('SFA')
    .controller('AdminMenuController', function($scope, adminService) {
        this.pending = '';
        adminService.getPendingItems().then((result) => {
            this.pending = result.count;
        });

    });