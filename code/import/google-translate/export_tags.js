var db = require("db");

function getCollection(err, db) {
    db.collection('nodes_tags', enumerate);
}

function enumerate(err, nodes_tags) {
    nodes_tags.find({}).each(writeTag);
}

function writeTag(err, node) {
    console.log(node.tag);
}

db.open('german_tag_graph', getCollection);
