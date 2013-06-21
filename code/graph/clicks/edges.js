load('../edges.js')

db.clicks.ensureIndex({articleId: 1});
db.clicks.ensureIndex({query: 1});
db.clicks.ensureIndex({articleId: 1, query: 1});

neighbors = function(nodeId) {

    var ret = [];

    db.clicks.find(
        {query: nodeId},
        {articleId: 1}
    ).forEach(function(click_with_query) {

        db.clicks.find(
            {articleId: click_with_query.articleId}, 
            {query: 1}
        ).forEach(function(other_click) {
        if (other_click.query != nodeId) {
                ret.push(other_click.query);
        }
        });
    });

    return ret;
};

buildEdges(
    db.click_graph_nodes,
    db.click_graph_edges,
    neighbors
);
