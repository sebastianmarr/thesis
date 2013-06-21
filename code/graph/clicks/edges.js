load('graph/edges.js')

db.tmp_clicks.ensureIndex({articleId: 1});
db.tmp_clicks.ensureIndex({query: 1});
db.tmp_clicks.ensureIndex({articleId: 1, query: 1});

neighbors = function(nodeId) {

    var ret = [];

    db.tmp_clicks.find(
        {query: nodeId},
        {articleId: 1}
    ).forEach(function(click_with_query) {

        db.tmp_clicks.find(
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
