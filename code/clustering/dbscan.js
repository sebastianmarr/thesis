dbscan = function(edges_collection, eps, minPts) {

    var cluster = 0

    // keep clustering information in temporary collection
    // pre-calculate edges within eps for each node
    db.tmp_dbscan.drop()
    db.tmp_dbscan.ensureIndex({v: 1})
    db.tmp_dbscan.ensureIndex({c: 1})
    edges_collection.find({},{_id:1, tn:1}).forEach(function(x) {
        db.tmp_dbscan.insert({
            _id: x._id,
            e: x.tn.filter(function(n) { return n.ochiai > eps }).map(function(y) { return {id: y.id, d: y.ochiai}}), // eps-neighborhood
            v: false, // visited
        })
    })

    // main loop of algorithm
    while (node = db.tmp_dbscan.findOne({v: false})) {

        node.v = true
        // get all neighbor nodes
        var neighborPts = regionQuery(node, eps)
        if (neighborPts.length < minPts) {
            node.n = true
            db.tmp_dbscan.save(node)
        } else {
            cluster++
            expandCluster(node, neighborPts, cluster, eps, minPts)
        }
    }

    // print number of found clusters
    print(cluster + " clusters found")

    // copy results into separate collection
    db.dbscan_results.drop()
    db.tmp_dbscan.find().forEach(function(x) {
        db.dbscan_results.insert({
            _id: x._id,
            c: x.c
        })
    })

    return {numClusters: cluster, numNoise: db.tmp_dbscan.count({n: true})}
}

expandCluster = function(node, neighborPts, cluster, eps, minPts) {
    node.c = cluster
    while (n = neighborPts.pop()) {
        if (!n.v) {
            n.v = true
            furtherNeighbors = regionQuery(n, eps)
            if (furtherNeighbors.length >= minPts) {
                // add further neighbors to queue (without producing duplicates)
                furtherNeighbors.forEach(function(f) {
                    if (!neighborPts.some(function(x) { return x._id == f._id })) {
                        neighborPts.push(f)
                    }
                })
            }
            if (!n.c) {
                n.c = cluster
            }
        }
        db.tmp_dbscan.save(n)
    }
    db.tmp_dbscan.save(node)
}

regionQuery = function(node, eps) {
    var neighborPts = db.tmp_dbscan.find({_id: {$in: node.e.map(function(x){return x.id})}}).toArray()
    neighborPts.push(node) // include the node itself (as described in algorithm)
    return neighborPts 
}