var tagDB = db.getSiblingDB('german_tag_graph');
var graphDB =  db.getSiblingDB('graph');

graphDB.nodes.ensureIndex({string: 1, language: 1});
graphDB.nodes.ensureIndex({language: 1, string: 1});
graphDB.edges.ensureIndex({type: 1, source: 1});
graphDB.edges.ensureIndex({source: 1});

var scripts = [
    'integration/tags.js',
    'integration/languageDetection.js',
    'integration/clicks.js'
];

scripts.forEach(function(script_path) {
    print(script_path.split('/').pop().slice(0, -3));
    load(script_path);
});
