angular.module('SFA')
    .controller('GalleryUpdateController', function($scope, SweetAlert, fileService, galleryService, $window, utilsService, $uibModal, $timeout, urlService) {
        $scope.inProgress = true;
        var currentTab = $window.location.hash.slice(1);
        if (currentTab.startsWith('/')) {
            currentTab = currentTab.substring(1);
        }
        this.activeTab = currentTab || 'info';
        this.galleryData = {};
        const galleryId = $window.SFA.gallery_id,
            bannersCount = 4;
        this.hasError = (form, field, validation) => {
            return utilsService.hasError($scope, form, field, validation);
        };

        this.isTabActive = (name) => {
            return this.activeTab === name;
        };
        this.changeTab = (name) => {
            this.activeTab = name;
        };

        galleryService.getGalleryForEdit(galleryId).then((gallery) => {
                this.galleryData = gallery;
                $scope.inProgress = false;
            },
            (err) => {
                console.log(err);
                $scope.inProgress = false;
                $window.location.href = '/';

            });
        this.onSubmit = () => {
            if ($scope.galleryForm.$valid) {
                $scope.inProgress = true;

                /* jshint ignore:start */
                let dataToSave = {...this.galleryData };
                /* jshint ignore:end */
                if (dataToSave.telephone.indexOf('+') === -1) {
                    var phoneCountryData = angular.element('#telephone').intlTelInput("getSelectedCountryData");
                    dataToSave.telephone = `+${dataToSave.telephone}`;
                }

                galleryService.updateGallery(galleryId, dataToSave).then(() => {
                    $scope.inProgress = false;
                    SweetAlert.swal("Success!", "Gallery information updated", "success");
                }, (err) => {
                    SweetAlert.swal("Oops...!", err.message, "error");
                    $scope.inProgress = false;

                });
            }
        };

        this.editAddress = () => {
            let modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'gallery-address-edit-modal.html',
                controller: 'GalleryAddressEditModalController',
                controllerAs: 'ctrl',
                resolve: {

                    currentAddress: () => {
                        return {
                            id: galleryId,
                            address: this.galleryData.address,
                            address2: this.galleryData.address2,
                            city_name: this.galleryData.city_name,
                            city_id: this.galleryData.city_id,
                            state: this.galleryData.state,
                            state_code: this.galleryData.state_code,
                            state_id: this.galleryData.state_id,
                            country_name: this.galleryData.country_name,
                            country_id: this.galleryData.country_id,
                            country_code: this.galleryData.country_code,
                            latitude: this.galleryData.latitude,
                            longitude: this.galleryData.longitude,
                            zipcode: this.galleryData.zipcode
                        };
                    }
                }
            });

            modalInstance.result.then((result) => {
                /* jshint ignore:start */
                this.galleryData = {
                        ...this.galleryData,
                        ...result
                    }
                    /* jshint ignore:end */
            });
        };


        this.editArtistName = (artist) => {
            let modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'change-artist-name-modal.html',
                controller: 'ChangeArtistNameModalController',
                controllerAs: 'ctrl',
                resolve: {

                    artist: () => {
                        /* jshint ignore:start */
                        return {
                            ...artist
                        };
                        /* jshint ignore:end */
                    }
                }
            });

            modalInstance.result.then((result) => {
                artist.name = result;
            });
        };

        this.hasMainBanner = () => {
            if (this.galleryData.banners) {
                return this.galleryData.banners.length;

            }
            return false;
        };
        this.getMainBanner = () => {
            return this.galleryData.banners[0];
        };

        this.bannersMissing = () => {
            if (this.galleryData.banners) {
                return bannersCount - this.getOtherBanners().length;
            }
            return bannersCount;
        };

        this.getOtherBanners = () => {
            if (this.galleryData.banners) {
                return this.galleryData.banners.slice(1);
            }
            return [];
        };

        this.editBanners = () => {
            let modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'gallery-banners-edit-modal.html',
                controller: 'GalleryBannersEditModalController',
                controllerAs: 'ctrl',
                size: 'lg',
                keyboard: false,
                backdrop: 'static',
                resolve: {
                    banners: () => {
                        return this.galleryData.banners;
                    },
                    availableCount: () => {
                        return bannersCount + 1;
                    },
                    galleryId: () => {
                        return galleryId;
                    }
                }

            });

            modalInstance.result.then((result) => {
                this.galleryData.banners = result;
            });
        };

        this.changeEventStatus = (event, type) => {
            $scope.inProgress = true;
            galleryService.changeEventStatus(galleryId, event.id, type).then((result) => {
                event.status = result.status;
                SweetAlert.swal("Success", 'Status changed successfully', "success");
                $scope.inProgress = false;
            }, (error) => {
                $scope.inProgress = false;
                SweetAlert.swal("Oops...!", error.message, "error");
            });
        };

        this.buildGalleryUrl = () => {
            return this.galleryData && this.galleryData.name ? $window.SFA.frontend_url + urlService.buildGalleryUrl(this.galleryData.id, this.galleryData.name) : '';
        };

        let showEventModal = (event) => {
            let modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'gallery-event-edit-modal.html',
                controller: 'GalleryEventEditModalController',
                controllerAs: 'ctrl',

                resolve: {
                    event: () => {
                        return {
                            id: event.id,
                            start_date: event.start_date,
                            end_date: event.end_date,
                            name: event.name,
                            description: event.description,
                            image: event.image,
                            weblink: event.weblink
                        };

                    },
                    galleryId: () => {
                        return galleryId;
                    },
                    galleryName: () => {
                        return this.galleryData.name;
                    }
                }

            });

            modalInstance.result.then((result) => {
                this.galleryData.events = result;
            });
        };

        this.newEvent = () => {
            showEventModal({});
        };
        this.editEvent = (event) => {
            showEventModal(event);
        };

        this.removeEvent = (event) => {

            SweetAlert.swal({
                    title: "Are you sure?",
                    text: "This will remove event from your gallery",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonText: "Yes, remove it!"
                },
                (isConfirm) => {
                    if (isConfirm) {
                        $scope.inProgress = true;

                        galleryService.removeEvent(galleryId, event.id).then(() => {
                            SweetAlert.swal("Success", 'Event removed successfully', "success");
                            $scope.inProgress = false;
                            let index = this.galleryData.events.indexOf(event);
                            this.galleryData.events.splice(index, 1);
                        }, (error) => {
                            $scope.inProgress = false;
                            SweetAlert.swal("Oops...!", error.message, "error");
                        });
                    }
                });
        };

        this.newArtist = () => {
            let modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'gallery-new-artist-modal.html',
                controller: 'GalleryNewArtistModalController',
                controllerAs: 'ctrl',

                resolve: {
                    galleryId: () => {
                        return galleryId;
                    }
                }

            });

            modalInstance.result.then((result) => {
                this.galleryData.artists.push(result);
            });
        };

        this.changeArtistOrder = (artistId, action) => {
            $scope.inProgress = true;

            galleryService.changeArtistOrder(galleryId, artistId, action).then((result) => {
                let newArtistOrder = [];
                $scope.inProgress = false;
                result.artists.forEach((newArtist) => {
                    this.galleryData.artists.forEach((artist) => {
                        if (artist.id === newArtist.id) {
                            newArtistOrder.push(artist);
                        }
                    });
                });
                this.galleryData.artists = newArtistOrder;
                SweetAlert.swal("Success", 'Order updated successfully', "success");

            }, (error) => {
                $scope.inProgress = false;
                SweetAlert.swal("Oops...!", error.message, "error");
            });
        };

        this.editArtistArtworks = (artist) => {
            let modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'gallery-artist-edit-modal.html',
                controller: 'GalleryArtistEditModalController',
                controllerAs: 'ctrl',
                size: 'lg',
                keyboard: false,
                backdrop: 'static',
                resolve: {
                    galleryId: () => {
                        return galleryId;
                    },
                    galleryHasFacebook: () => {
                        return this.galleryData.fb_connected;
                    },
                    galleryHasTwitter: () => {
                        return this.galleryData.twitter_connected;
                    },
                    artist: () => {
                        let artworks = [];
                        angular.copy(artist.artworks, artworks);
                        /* jshint ignore:start */
                        return {
                            ...artist,
                            artworks
                        };
                        /* jshint ignore:end */
                    }
                }
            });

            modalInstance.result.then((result) => {
                let index = this.galleryData.artists.indexOf(artist);
                this.galleryData.artists[index] = { artworks: [] };
                //REINIT SLICK SLIDER
                $timeout(() => {
                    this.galleryData.artists[index] = result;
                }, 5);
            });
        };

        this.isOpenend = (time) => {
            return time !== '' && time !== 'BA';
        };
        this.isByAppointment = (time) => {
            return time === 'BA';
        };
        this.editOpeningHours = () => {
            let modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'gallery-opening-hours-modal.html',
                controller: 'GalleryOpeningHoursModalController',
                controllerAs: 'ctrl',
                size: 'lg',
                resolve: {
                    galleryId: () => {
                        return galleryId;
                    },
                    currentOpeningHours: () => {
                        const { sun_opening, tue_opening, tue_closing, sun_closing, mon_opening, mon_closing, wed_opening, wed_closing, thu_opening, thu_closing, fri_opening, fri_closing, sat_opening, sat_closing } = this.galleryData;
                        return {
                            tue_opening,
                            tue_closing,
                            sun_opening,
                            sun_closing,
                            mon_opening,
                            mon_closing,
                            wed_opening,
                            wed_closing,
                            thu_opening,
                            thu_closing,
                            fri_opening,
                            fri_closing,
                            sat_opening,
                            sat_closing
                        };
                    }
                }
            });

            modalInstance.result.then((result) => {
                /* jshint ignore:start */
                this.galleryData = {
                    ...this.galleryData,
                    ...result
                };
                /* jshint ignore:end */
            });
        };

    });
