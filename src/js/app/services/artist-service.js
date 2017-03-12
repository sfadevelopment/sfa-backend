angular.module('SFA')
    .service('artistService', function galleriesService(commonService) {

        return {
            getArtistSuggestionByName: (searchText) => {
                return commonService.get(`/api/web/artist/suggestions-by-name?searchText=${searchText}`);
            },
            updateArtistName: (artistId, name) => {
                return commonService.post(`/api/web/artist/update-name/${artistId}`, { name });
            }

        };
    });