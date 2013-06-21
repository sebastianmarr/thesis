var buildEdges = function(nodeCollection, edgeCollection, getNeighbors) {

    edgeCollection.drop();


    nodeCollection.distinct('_id').forEach(function(nodeId) {

        var temp_tn = {};

        var edge = {
            _id: nodeId,
            tn: []
        };

        getNeighbors(nodeId).forEach(function(neighborId) {

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

        edgeCollection.insert(edge);
    });
};
