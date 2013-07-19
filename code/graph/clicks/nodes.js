// give them real ids and count occs (count of clicks)
var map = function() {
    emit(new ObjectId,
        {
            occs: this.value.clicks.length,
            query: this._id.q,
            language: this._id.l,
            clicks: this.value.clicks
        });
}

var reduce = function(key, values) {
    return values[0];
}

db.graph_nodes_clicks.drop();
db.mr_clicks_joined.mapReduce(
    map,
    reduce,
    {
        out:
        {
            reduce: "graph_nodes_clicks",
            sharded: true
        }
    }
);
