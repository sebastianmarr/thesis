db.clicks.ensureIndex({language: 1});
db.clicks.ensureIndex({articleId: 1});
db.clicks.ensureIndex({productId: 1});
db.clicks.ensureIndex({query: 1});

db.clicks.remove({query: {$in: [null, ""]}});

db.clicks.find().forEach(function(click) {
    var repl = new RegExp('/\"/', 'g')
    // click.query = click.query.replace(repl, "");
    // db.clicks.save(click);
});

// nodes
db.click_graph_nodes.drop();
db.clicks.distinct('query').forEach(function(query) {

    var node = {
        _id: query,
        occs: db.clicks.count({query: query})
    };

    db.click_graph_nodes.insert(node);
});

// edges
db.click_graph_edges.drop();
db.click_graph_nodes.find().forEach(function(node) {

    var temp_tn = {};

    var edge = {
        _id: node._id,
        tn: []
    };

    db.clicks.find(
        {query: node._id},
        {articleId: 1}
    ).forEach(function(click_with_query) {

        db.clicks.find({articleId: click_with_query.articleId}, {query: 1}).forEach(function(other_click) {
            
            if (temp_tn[other_click.query]) {
                temp_tn[other_click.query] ++;
            } else {
                temp_tn[other_click.query] = 1;
            };
        });
    });

    for (var e in temp_tn) {
        edge.tn.push({
            id: e,
            occs: temp_tn[e]
        });
    };

    db.click_graph_edges.insert(edge)
});

// measures
db.click_graph_edges.find().forEach(function(edge) {

    var node_occs = db.click_graph_nodes.findOne({_id: edge._id},{occs: 1}).occs

    edge.tn.forEach(function(n) {
        var target_occs = db.click_graph_nodes.findOne({_id: n.id},{occs: 1}).occs
        n.dice = 2 * n.occs / (node_occs + target_occs)
        n.jaccard = n.occs / (node_occs + target_occs - n.occs)
        n.ochiai = n.occs / (Math.sqrt(node_occs * target_occs))
    })
    db.click_graph_edges_measured.save(edge)
})