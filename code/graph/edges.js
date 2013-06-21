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
                temp_tn[neighborId].occs ++;
            } else {
                temp_tn[neighborId] = {
                    id: neighborId,
                    occs: 1
                };
            };

        });

        for (var e in temp_tn) {
            edge.tn.push(temp_tn[e]);
        };

        edgeCollection.insert(edge);
    });
};
