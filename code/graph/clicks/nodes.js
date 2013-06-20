load('../nodes.js')

db.clicks.remove({query: {$in: [null, ""]}});

db.clicks.find().forEach(function(click) {
    var repl = new RegExp('/\"/', 'g')
    click.query = click.query.replace(repl, "");
    db.clicks.save(click);
});

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
