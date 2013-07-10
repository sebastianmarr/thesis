var db = require('db');
var fs = require('fs');
var https = require('https');
var async = require('async');

var googleApiKey = "AIzaSyCzf-kyzTQ3jdVXZdqr_RSXlsP_ehFSvFk"

db.open('google_language_detection', function(err, database) {

    if (err) {
        exit(1);
    }

    detection_db = database;
    var lines = fs.readFileSync('tags.txt').toString().split(/\r?\n/);
    async.each(lines, processLine, function(err) {
        process.exit(0);
    });

});

function processLine(string, callback) {

    detectLanguage(string, function processDetectionResult(err, detectionResult) {

        if (err) {
            callback(err);
        } else {
            writeDetectionToDB(string, detectionResult, function(err) {
                callback(err);
            });
        }
    });
}

function detectLanguage(string, callback) {

    var path = '/language/translate/v2/detect?key=' + googleApiKey + '&q=' + encodeURIComponent(string);  
    var options = {
        host: "www.googleapis.com",
        path: path
    };

    https.get(options, function(res) {

        var data = '';

        res.on('data', function (chunk){
            data += chunk;
        });

        res.on('end',function(){

            var obj = JSON.parse(data);
            callback(null, obj);
           
        });

    }).on('error', function(err) {
        callback(err, null);
    });
}

function writeDetectionToDB(string, detection, callback) {

    detection_db.collection('detections', function(err, coll) {

        var doc = {
            _id: string,
            detections: detection.data.detections[0]
        }

        coll.insert(doc, function(err) {
            callback(err);
        });
    });
}
