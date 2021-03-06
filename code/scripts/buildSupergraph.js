var tagDB = db.getSiblingDB('german_tag_graph');
var graphDB =  db.getSiblingDB('graph');
var languageDetectionDB =  db.getSiblingDB('google_language_detection');
var clicktrackingDB =  db.getSiblingDB('clicktracking');
var wortschatzDB = db.getSiblingDB('wortschatz');

var scripts = [
    'integration/tags.js',
    'integration/languageDetection.js',
    'integration/clicks.js'
    'integration/buildTextIndex.js'
    'integration/wortschatz.js'
];

scripts.forEach(function(script_path) {
    print(script_path.split('/').pop().slice(0, -3));
    load(script_path);
});
