var csv = require('fast-csv');
var Promise = require("bluebird");
var fs = Promise.promisifyAll(require('fs'));

String.prototype.endsWith = function(suffix) {
        return this.match(suffix+"$") == suffix;
};

var fileRead = new Promise(function(resolve, reject) {
    var stream = fs.createReadStream("new list.csv");

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

Promise.all([fs.readFileAsync('./import_1.json', 'utf8').then(function(data){
            return JSON.parse(data).results;
        }),fs.readFileAsync('./import_2.json', 'utf8').then(function(data){
            return JSON.parse(data).results;
        }),fs.readFileAsync('./import_3.json', 'utf8').then(function(data){
            return JSON.parse(data).results;
        }),fs.readFileAsync('./import_4.json', 'utf8').then(function(data){
            return JSON.parse(data).results;
        }),
        
        fileRead
]).spread(function result(imp1, imp2, imp3, imp4, csv){
    
    var merged = { "results" : imp1.concat(imp2).concat(imp3).concat(imp4)};
    console.log("total merged",merged.results.length);
    console.log("total csv",csv.length);
    var totalCount = 0;
    csv.forEach(csvLine => {
        var found = false;
        for (var i = 0;i< merged.results.length; i++){
            var jsonName = merged.results[i].name.trim();
            var csvName = csvLine[3].trim();

            merged.results[i].searchable_names = merged.results[i].searchable_names.map(name => {return name.toLowerCase()});
            merged.results[i].searchable_locations = merged.results[i].searchable_locations.map(name => {return name.toLowerCase()});
            if(csvName.toLowerCase().endsWith("llc") || csvName.toLowerCase().endsWith("inc")){
                csvName = csvName.substring(0, csvName.length - 3).trim();
            }
            
            if(csvName.toLowerCase() === jsonName.toLowerCase().trim()){
                console.log("exists", csvName, csvLine[17], csvLine[18], csvLine[50]);
                found = true;
                merged.results[i].web = csvLine[17];
                merged.results[i].phone = csvLine[18];
                merged.results[i].email = csvLine[50];
                totalCount++;
                break;
            } 
        }

        if(!found) {
            console.log("NO " , csvName);
        }
    });
    fs.writeFileAsync("./updated.json", JSON.stringify(merged, null, '\t'));
    console.log("updated", totalCount);


});