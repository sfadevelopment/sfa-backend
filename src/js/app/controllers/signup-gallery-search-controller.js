angular.module('SFA')
    .controller('SignupGallerySearchController', function($scope, locationService, galleryService, $window, urlService) {
        let self = this;
        this.gallerySearchData = {
            address: '',
            adressDetails: {},
            name: ''
        };
        this.searched = false;
        locationService.getUserLocation().then(function(locationData) {
            self.gallerySearchData.address = locationData.address;
            self.gallerySearchData.adressDetails = {
                latitude: locationData.lat,
                longitude: locationData.lon
            };
        });

        function loadGalleries() {
            $scope.$parent.startProgress();
            galleryService.searchGalleryForClaim(self.gallerySearchData.name, self.gallerySearchData.adressDetails, 5, self.page).then(function(data) {
                if (angular.isArray(data) && data.length > 0) {
                    if (self.page === 0) {
                        self.results = data;
                    } else {
                        self.results = self.results.concat(data);
                    }
                } else {
                    self.results = [];
                }
                self.searched = true;
                $scope.$parent.stopProgress();
            }).catch(function(err) {
                self.searched = true;
                $scope.$parent.stopProgress();
                console.log("Error loading.", err);
            });
        }

        self.loadMoreGalleries = function() {
            self.page = self.page + 1;
            loadGalleries();
        };


        self.onGallerySearch = function() {
            self.page = 0;
            loadGalleries();
        };

        self.buildGalleryUrl = function(gallery) {
            return $window.SFA.frontend_url + urlService.buildGalleryUrl(gallery.id, gallery.name);
        };
    });
