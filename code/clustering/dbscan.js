dbscan = function(coll, eps, minPts) {

    var c = 0

    // cleanup and index generation
    coll.ensureIndex({"tn.ochiai" : 1})
    print("measure index done")
    coll.ensureIndex({visited: 1})
    print("visited index done")
    coll.update({},{$set:{visited:false}, $unset: {cluster: 1}}, {multi: true})
    print("cleanup done")

    // filter each node for edges within eps
    coll.find().forEach(function(e) {
        e.en = e.tn.filter(function(n) { return n.ochiai > eps })
        coll.save(e)
    })
    print("eps neighbors done")

    // main loop
    while (n = coll.findOne({visited: false})) {
        n.visited = true
        if (n.en.length < minPts) {
            n.noise = true
        } else {
            c++
            print("new cluster no." + c)
            expandCluster(n, n.en, c, eps, minPts)
        }
        print(coll.count({visited: false}) + "unvisited nodes left")
    }    
}

expandCluster = function(node, neighbors, cluster, eps, minPts) {
    node.cluster = c

    q = neighbors.map(function(n) {return n.id})
    while (n = q.pop()) {
        neighbor = coll.findOne({_id:n})
        neighbor.visited = true
        if (n.en.length >= minPts) {
            n.en.forEach(function(e) {
                if (q.indexOf(e.id) < 0) {
                    q.push(e.id)
                }
            })
        }
        if (!neighbor.cluster) {
            neighbor.cluster = c
        }
        coll.save(neighbor)
    }
}