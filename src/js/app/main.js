angular.module('SFA', ['ngStorage', 'ui.bootstrap', 'validation.match', 'ngFileUpload','nya.bootstrap.select', 'dndLists', 'ngIntlTelInput', 'ui.mask', 'oitozero.ngSweetAlert', 'slickCarousel', 'SFA-commons', 'ui.select', 'ngSanitize'])
    .config((ngIntlTelInputProvider) => {
        ngIntlTelInputProvider.set({ defaultCountry: 'us' });
    });
require('./directives');
require('./services');
require('./controllers');
require('./constants');
require('./filters');
