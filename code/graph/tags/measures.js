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

db.edges_tags.drop();
db.mr_edges_tags.mapReduce(map, reduce, {out: {replace: "edges_tags"}});
