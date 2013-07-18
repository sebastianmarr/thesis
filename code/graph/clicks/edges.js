var map = function() {
    var id = this._id;
    var occs = this.value.occs;

    this.value.clicks.forEach(function(click) {
        emit('a_' + click.articleId, {q: [{q: id, o: occs}]});
        emit('p_' + click.productId, {q: [{q: id, o: occs}]});
    });
}

var reduce = function(key, values) {

    return values.reduce(function(memo, value) {

        if (value.q) {
            memo.q = memo.q.concat(value.q);
        }

        return memo;

    }, {q: []});
}

db.mr_click_co_occs.drop();
db.graph_nodes_clicks.mapReduce(map, reduce, {out: {replace: "mr_click_co_occs"}});

// build pairs
var map = function() {

    var q = this.value.q;

    q.forEach(function(query) {
        query_id = query.q;
        q.forEach(function(other_query) {
            other_query_id = other_query.q;
            if (query_id != other_query_id) {
                emit({s: query_id, t: other_query_id}, {occs: 1, s_occs: query.o, t_occs: other_query.o});
            }
        });
    });
}

var reduce = function(key, values) {

    var s_occs = values[0].s_occs;
    var t_occs = values[0].t_occs;

    var reduction = values.reduce(function(memo, value) {
        if (value.occs) {
            memo.occs += value.occs;
        }
        return memo;
    }, {occs: 0, s_occs: s_occs, t_occs: t_occs});

    return reduction;
}

db.mr_click_graph_edges.drop();
db.mr_click_co_occs.mapReduce(map, reduce, {out: {merge: "mr_click_graph_edges"}});
