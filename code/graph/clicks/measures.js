var map = function() {

    var sourceOccs = this.value.s_occs;
    var targetOccs = this.value.t_occs;
    var edgeOccs = this.value.occs;

    emit(new ObjectId, {
        s: this._id.s,
        t: this._id.t,
        occs: edgeOccs,
        dice: 2 * edgeOccs / (sourceOccs + targetOccs),
        jaccard: edgeOccs / (sourceOccs + targetOccs - edgeOccs),
        cosine: edgeOccs / (Math.sqrt(sourceOccs * targetOccs))
    });
}

var reduce = function(key, values) {
    return values[0];
}

db.graph_edges_clicks.drop();
db.mr_click_graph_edges.mapReduce(
    map,
    reduce,
    {
        out: 
        {
            reduce: "graph_edges_clicks",
            sharded: true
        }
    }
);
