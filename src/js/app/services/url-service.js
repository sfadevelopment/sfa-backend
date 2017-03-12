angular.module('SFA')
    .service('urlService', function urlService(utilsService) {

        return {
            buildGalleryUrl: (id, name) => {
                return '/' + utilsService.slug(name) + '/' + id;
            }
        };
    });
