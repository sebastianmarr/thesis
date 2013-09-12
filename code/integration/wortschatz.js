var graphDB =  db.getSiblingDB('graph');
var wortschatzDB = db.getSiblingDB('wortschatz');

// integrate wortschatz properties onto single words
graphDB.nodes.ensureIndex({singleWord: true, string: true});
wortschatzDB.mr_cleanup.find().forEach(function(word) {
    graphDB.nodes.update(
        {singleWord: true, string: word._id},
        {$set: {wortschatzProperties: word.value}},
        {multi: true}
    );
});

// integrate domain edges between single words
wortschatzDB.mr_domain_edges.find().forEach(function(edge) {
    graphDB.nodes.find({singleWord: true, string: edge._id.s}).forEach(function(sourceNode) {
        graphDB.nodes.find({singleWord: true, string: edge._id.t}).forEach(function(targetNode) {
            var newEdge = {
                source: sourceNode._id,
                target: targetNode._id,
                type: "shared_domains",
                domains: edge.value.domains,
                domainCount: edge.value.domains.length
            };
            graphDB.edges.insert(newEdge);
        });
    });
});
