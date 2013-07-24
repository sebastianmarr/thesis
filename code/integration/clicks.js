var clicktrackingDB = db.getSiblingDB('clicktracking');
var graphDB =  db.getSiblingDB('graph');

clicktrackingDB.graph_nodes_clicks.find().forEach(importClickNode);

function importClickNode(node) {

    var clickData = {
        occurences: node.value.occs,
        clicks: node.value.clicks
    };

    graphDB.nodes.update(
        {language: node.value.language, string: node.value.query},
        {$set: {clickProperties: clickData}},
        {upsert: true}
    );
}
