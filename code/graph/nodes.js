var buildNodes = function(nodeIds, nodeOccs, nodeProperties, nodeCollection) {
    nodeCollection.drop();
    
    nodeIds.forEach(function(nodeId) {

        var node = {
            _id: nodeId,
            occs: nodeOccs(nodeId)
        };

        props = nodeProperties(nodeId);

        for (var prop in props) {
            node[prop] = props[prop];
        };

        nodeCollection.insert(node);
    });
};
