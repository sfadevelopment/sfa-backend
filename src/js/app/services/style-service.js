angular.module('SFA')
    .service('styleService', function artworksService(commonService) {

        return {
            getStyles: function() {
                return commonService.get("/api/web/styles-suggest?");
            }
        };
    });