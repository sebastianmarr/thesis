var buildMeasures = function(nodeCollection, edgeCollection, target_edge_collection) {

    target_edge_collection.ensureIndex({s: 1});
    target_edge_collection.ensureIndex({t: 1});

    edgeCollection.find().addOption(DBQuery.Option.noTimeout).forEach(function(edge) {

        var sourceOccs = nodeCollection.findOne({"_id": edge._id.s}).occs;
        var targetOccs = nodeCollection.findOne({"_id": edge._id.t}).occs;
        var edgeOccs = edge.value.occs;

        target_edge_collection.insert({
            s: edge._id.s,
            t: edge._id.t,
            occs: edgeOccs,
            dice: 2 * edgeOccs.occs / (sourceOccs + targetOccs),
            jaccard: edgeOccs / (sourceOccs + targetOccs - edgeOccs),
            cosine: edgeOccs / (Math.sqrt(sourceOccs * targetOccs))
        });
    });
};

buildMeasures(db.nodes_tags, db.mr_edges_tags, db.edges_tags);
