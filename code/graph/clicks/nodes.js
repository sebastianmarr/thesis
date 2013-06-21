load('graph/nodes.js')

db.tmp_clicks.ensureIndex({query: 1});

var ids = db.tmp_clicks.distinct('query');

var occs = function(nodeId) {
    return db.tmp_clicks.count({query: nodeId});
};

var props = function(nodeId) {
    return null;
}

buildNodes(
    ids,
    occs,
    props,
    db.click_graph_nodes
);
