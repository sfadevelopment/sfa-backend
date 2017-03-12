angular.module('SFA')
    .service('parseService', function locationService($window, $q, SFA_MESSAGES) {
        Parse.initialize($window.SFA.app_id, $window.SFA.app_key);

        return {
            uploadFile: (filename, file) => {
                if (file.size > 2097152) {
                    return $q.reject({ message: SFA_MESSAGES.file_too_big });
                }
                var parseFile = new Parse.File(filename, file);
                return parseFile.save();
            },

            buildFileName: (filename) => {
                const fileExtension = (/[.]/.exec(filename)) ? /[^.]+$/.exec(filename) : undefined;
                return `parse-file.${fileExtension}`;
            }
        };

    });
