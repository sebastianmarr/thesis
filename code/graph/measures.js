var buildMeasures = function(nodeCollection, edgeCollection) {

    edgeCollection.find().addOption(DBQuery.Option.noTimeout).forEach(function(edge) {

        var node_occs = nodeCollection.findOne({_id: edge._id},{occs: 1}).occs;

        edge.tn.forEach(function(n) {
            var target_occs = nodeCollection.findOne({_id: n.id},{occs: 1}).occs;
            n.dice = 2 * n.occs / (node_occs + target_occs);
            n.jaccard = n.occs / (node_occs + target_occs - n.occs);
            n.ochiai = n.occs / (Math.sqrt(node_occs * target_occs));
        });
        edgeCollection.save(edge);
    });
};
