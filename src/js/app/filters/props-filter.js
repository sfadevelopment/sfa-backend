angular.module('SFA').filter('propsFilter', function() {
    return (items, props) => {
        let out = [];

        if (angular.isArray(items)) {
            items.forEach(function(item) {
                let itemMatches = false;

                let keys = Object.keys(props);
                for (let i = 0; i < keys.length; i++) {
                    let prop = keys[i],
                        text = props[prop].toLowerCase();
                    if (item[prop].toString().toLowerCase().indexOf(text) !== -1) {
                        itemMatches = true;
                        break;
                    }
                }
                if (itemMatches) {
                    out.push(item);
                }
            });
        } else {
            // Let the output be the input untouched
            out = items;
        }

        return out;
    };
});