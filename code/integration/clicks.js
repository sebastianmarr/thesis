var clicktrackingDB = db.getSiblingDB('clicktracking');
var graphDB =  db.getSiblingDB('graph');

// nodes
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

//edges
function importClickEdge(edge) {

    var source = clicktrackingDB.graph_nodes_clicks.findOne({_id: edge.value.s});
    var target = clicktrackingDB.graph_nodes_clicks.findOne({_id: edge.value.t});

    var integratedSource = graphDB.nodes.findOne({string: source.value.query, language: source.value.language});
    var integratedTarget = graphDB.nodes.findOne({string: target.value.query, language: target.value.language});

    var integratedEdge = {
        source: integratedSource._id,
        target: integratedTarget._id,
        type: 'click-co-occurence',
        occurences: edge.value.occs,
        dice: edge.value.dice,
        jaccard: edge.value.jaccard,
        cosine: edge.value.cosine
    };

    graphDB.edges.insert(integratedEdge);

}   

clicktrackingDB.graph_edges_clicks.find().forEach(importClickEdge);
