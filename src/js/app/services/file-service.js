angular.module('SFA')
    .service('fileService', function galleriesService(commonService) {

        return {
            isFileSizeValid: (size) => {
                return size < 2097152;
            }
        };
    });
