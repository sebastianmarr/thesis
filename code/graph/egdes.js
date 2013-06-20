var buildEdges = function(nodeCollection, edgeCollection, getNeighbors) {

    edgeCollection.drop();

    nodeCollection.find({},{_id: 1, occs: 1}).addOption(DBQuery.Option.noTimeout).forEach(function(node) {

        var temp_tn = {};

        var edge = {
            _id: node._id,
            tn: []
        };

        getNeighbors(node._id).forEach(function(neighborId) {

            if (temp_tn[neighborId]) {
                temp_tn[neighborId] ++;
            } else {
                temp_tn[neighborId] = 1;
            };

        });

        for (var e in temp_tn) {

            var edge_id = isNaN(parseInt(e)) ? e : parseInt(e);

            edge.tn.push({
                id: edge_id,
                occs: temp_tn[e]
            });
        };
    });
};