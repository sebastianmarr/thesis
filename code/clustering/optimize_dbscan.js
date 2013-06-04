var epss = [0.3,0.4,0.5,0.6,0.7,0.8,0.9]
var minPtss = [2,3,5,10,15,20]

epss.forEach(function(eps) {
    minPtss.forEach(function(minPts) {
        var clusterResult = dbscan(db.tag_graph_edges, eps, minPts)
        db.dbscan_optimization.insert({
            eps: eps,
            minPts: minPts,
            clusterResult: clusterResult
        })
    })
})