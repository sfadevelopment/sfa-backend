var csv = require('fast-csv');
var Promise = require("bluebird");
var fs = Promise.promisifyAll(require('fs'));

//
var geocoderProvider = 'google';
var httpAdapter = 'https';
var extra = {
    apiKey: 'AIzaSyDIMwxWzfAPdj0XA1tXlpqXNcLAf58Qen8', 
    formatter: null         // 'gpx', 'string', ...
};

var RateLimiter = require('limiter').RateLimiter;
var limiter = new RateLimiter(3, 'second');

var geocoder =  Promise.promisifyAll(require('node-geocoder')(geocoderProvider, httpAdapter, extra));


var fileRead = new Promise(function(resolve, reject) {
    var stream = fs.createReadStream("splitted 3.csv");

    var line = 0;
    var csvResult = [];
    var csvStream = csv()
        .on("data", function(data) {
            if (data.length > 0 && line > 0) {
                csvResult.push(data);
            }
            line++;
        })
        .on("end", function() {
            resolve(csvResult);
            console.log("done" + csvResult.length);
        });

    stream.pipe(csvStream);
});

Promise.all([fs.readFileAsync('./fromParse/City.json', 'utf8').then(function(data){
            return JSON.parse(data);
        }),
        fs.readFileAsync('./fromParse/State.json', 'utf8').then(function(data){
            return JSON.parse(data);
        }),
        fileRead
]).spread(function result(cities, states, csv){
    console.log(csv.length);
    var notFoundCount = 0;
    var moreThen1Found = 0;
    var queries ={timestamp: new Date()}
    return Promise.all(csv.map(function(csvRow){
       return Promise.all(states.results.map(function(state){
            if(csvRow[12] === state.state_code){
                return state; 
            }

       })).then(function(result){ 
            result = result.filter(function(n){ return n !== undefined });   
            if(result.length > 1 || result.length ===0){
                console.log("OMG!! State not found");
            }
            var state = result.pop();
            return Promise.all(cities.results.map(function(city){
                if(csvRow[11] === city.city && city.state.objectId === state.objectId){
                    return {"city" : city, "state" : state}; 
                }

           }));
       }).then(function(location){
            location = location.filter(function(n){ return n !== undefined }).pop(); 
            if(!location){
                console.log("\"City not found\", \"" + csvRow[3] + "\" , \" " + csvRow[11] + "\" , \"" + csvRow[12] + "\"");

            } else {

                return new Promise( function (resolve, reject) {
                    limiter.removeTokens(1, function() {
     
                        return geocoder.geocodeAsync(csvRow[10] + ' ' + csvRow[11] + ' ' + csvRow[12]).then(coords => {
                            //console.log(coords);
                            if(coords && coords[0]) {
                                const long = coords[0].longitude;
                                const lat = coords[0].latitude;
                            }

                            resolve(buildResult(csvRow, lat, long, location));
                            
                        }).catch(error => {
                            console.log(error);
                            console.log("\"Coords error\", \"" + csvRow[3] + "\" , \" " + csvRow[11] + "\" , \"" + csvRow[12] + "\"");

                            resolve(buildResult(csvRow, null, null, location));
                        });

                    });
                });

            }
        });
    })).then(function(result){
        result = result.filter(n => { return n !== undefined });  
        var toWrite = {
            "results" : result
        } 
        console.log(result.length);
        return fs.writeFileAsync("./test.json", JSON.stringify(toWrite, null, '\t'));
     });
        
        
}).catch(console.log.bind(console));

var buildResult = function(csvRow, lat, long, location){
    String.prototype.endsWith = function(suffix) {
        return this.match(suffix+"$") == suffix;
    };
    var name = csvRow[3].trim();
    if(name.toLowerCase().endsWith("llc") || name.toLowerCase().endsWith("inc")){
        name = name.substring(0, name.length - 3).trim();
    }
    var searchable_locations = csvRow[10].toLowerCase().split(" ");
    searchable_locations.push.apply(searchable_locations, csvRow[11].toLowerCase().split(" "));
    searchable_locations.push(csvRow[12]);
    
    return {
                "address": csvRow[4],
                "city": {
                    "__type": "Pointer",
                    "className": "City",
                    "objectId": location.city.objectId
                },
                "country": {
                    "__type": "Pointer",
                    "className": "Country",
                    "objectId": "Ve0w8v9yT3"
                },
                "createdAt": "2016-01-21T10:02:56.587Z",                   
                "location": {
                    "__type": "GeoPoint",
                    "latitude": lat,
                    "longitude": long
                },
                "name": name,
                "searchable_locations": searchable_locations,
                "searchable_names": name.split(" "),
                "state_code": location.state.state_code,                    
                "zipcode": csvRow[13]
            }
}
