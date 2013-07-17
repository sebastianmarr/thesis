var map = function() {
    emit(new ObjectId, this.value);
}

var reduce = function(key, values) {
    return values[0];
}

db.graph_nodes_clicks.drop();
db.mr_clicks_joined.mapReduce(map, reduce, {out: {replace: "graph_nodes_clicks", sharded: true}});
