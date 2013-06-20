load('../nodes.js')

db.clicks.ensureIndex({query: 1});

var ids = db.clicks.distinct('query');

var occs = function(nodeId) {
    return db.clicks.count({query: nodeId});
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
