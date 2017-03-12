angular.module('SFA')
    .service('adminService', function adminService(commonService) {
        return {
            getPendingItems: () => {
                return commonService.post('/admin/pending');
            },

            getGalleryInfoForEdit: (galleryId) => {
                return commonService.get(`/api/web/galleries/get-gallery-info-for-admin/${galleryId}`);
            },
            chnageGalleryStatus: (galleryId, action) => {
                return commonService.post(`/api/web/galleries/change-status/${galleryId}`, {
                    action
                });
            },
            changeGalleryNote: (galleryId, note) => {
                return commonService.post(`/api/web/galleries/update-note/${galleryId}`, {
                    note
                });
            },

            changeGalleryOwner: (galleryId, newSubscriberId, oldSubscriberId) => {
                return commonService.post(`/api/web/galleries/change-gallery-owner/${galleryId}`, {
                    newSubscriberId,
                    oldSubscriberId
                });
            }
        };
    });