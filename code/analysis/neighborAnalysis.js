var topNeighborsForTag = function(tag, n) {

    var tag_id = db.tag_graph_nodes.findOne({tag: tag})._id
    var edges = db.tag_graph_edges.findOne({_id: tag_id})

    var topNeighbors = []

    var measures = ['dice', 'jaccard', 'overlap', 'ochiai']

    measures.forEach(function(measure) {

        // sort edges by measure
        edges.tn.sort(function(a,b) {
            return b[measure] - a[measure]
        }).slice(0,n).forEach(function(topNeighborForMeasure) {

            if (!topNeighbors.some(function(x) { return x._id == topNeighborForMeasure.id})) {

                var ret = {
                    _id: topNeighborForMeasure.id,
                    tag: db.tag_graph_nodes.findOne({_id: topNeighborForMeasure.id}).tag
                }

                measures.forEach(function(measure) {
                    ret[measure] = topNeighborForMeasure[measure]
                })

                topNeighbors.push(ret)
            }
        })
    })

    db.neighbors.drop()

    topNeighbors.forEach(function(top) {
        db.neighbors.insert(top)
    })
}