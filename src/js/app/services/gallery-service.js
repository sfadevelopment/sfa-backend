angular.module('SFA')
    .service('galleryService', function galleriesService(commonService) {

        return {
            searchGalleryForClaim: (searchText, location, limit, page) => {
                var url = `/api/web/galleries/suggestion-for-claim?searchText=${searchText}&latitude=${location.latitude}&longitude=${location.longitude}&limit=${limit}&index=${page}`;
                return commonService.get(url);
            },

            getGalleryForEdit: (galleryId) => {
                return commonService.get(`/api/web/galleries/edit/${galleryId}`);
            },

            updateGallery: (galleryId, galleryData) => {
                return commonService.post(`/api/web/galleries/update/${galleryId}`, galleryData);
            },
            updateGalleryAddress: (galleryId, addressData) => {
                return commonService.post(`/api/web/galleries/update-address/${galleryId}`, addressData);
            },

            uploadGalleryBanner: (galleryId, bannerData) => {
                return commonService.post(`/api/web/galleries/update-banner/${galleryId}`, bannerData);
            },
            updateBanners: (galleryId, banners) => {
                return commonService.post(`/api/web/galleries/update-banners/${galleryId}`, { banners: banners });
            },

            removeBanner: (galleryId, bannerData) => {
                return commonService.post(`/api/web/galleries/remove-banner/${galleryId}`, bannerData);
            },

            changeEventStatus: (galleryId, eventId, action) => {
                return commonService.post(`/api/web/galleries/change-event-status/${galleryId}`, {
                    eventId,
                    action
                });
            },
            removeEvent: (galleryId, eventId) => {
                return commonService.post(`/api/web/galleries/remove-event/${galleryId}`, { eventId });

            },

            updateGalleryEvent: (galleryId, eventData) => {
                return commonService.post(`/api/web/galleries/update-event/${galleryId}`, eventData);
            },

            changeArtistOrder: (galleryId, artistId, action) => {
                return commonService.post(`/api/web/galleries/change-artist-order/${galleryId}`, { artistId: artistId, action: action });
            },
            addArtistToGallery: (galleryId, artistData) => {
                return commonService.post(`/api/web/galleries/add-artist/${galleryId}`, { artist: artistData });
            },
            removeArtworkFromGallery: (galleryId, artworkId) => {
                return commonService.post(`/api/web/galleries/remove-artwork/${galleryId}`, { artworkId });
            },

            updateGalleryArtwork: (galleryId, artworkData) => {
                return commonService.post(`/api/web/galleries/update-artwork/${galleryId}`, artworkData);
            },
            changeGalleryOpening: (galleryId, openingData) => {
                return commonService.post(`/api/web/galleries/update-gallery-opening/${galleryId}`, openingData);
            },
            updateArtistArtworks: (galleryId, artistId, artworks) => {
                return commonService.post(`/api/web/galleries/update-gallery-artist-artworks/${galleryId}`, {
                    artistId,
                    artworks
                });

            },
            saveFbPageLinkToGallery: (galleryId, pageId) => {
                return commonService.post(`/api/web/galleries/link-gallery-fb-page/${galleryId}`, { pageId });
            },

            removeFbPageLinkToGallery: (galleryId) => {
                return commonService.post(`/api/web/galleries/unlink-gallery-fb-page/${galleryId}`);
            },
            removeTwitterLinkToGallery: (galleryId) => {
                return commonService.post(`/api/web/galleries/unlink-gallery-twitter/${galleryId}`);

            }


        };
    });
