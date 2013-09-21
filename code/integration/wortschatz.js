var graphDB =  db.getSiblingDB('graph');
var wortschatzDB = db.getSiblingDB('wortschatz');

// integrate wortschatz properties onto single words
wortschatzDB.mr_cleanup.find().forEach(function(word) {
    graphDB.nodes.update(
        {string: word._id},
        {$set: {wortschatzProperties: word.value}},
        {multi: true}
    );
});

// integrate domain edges between single words
wortschatzDB.mr_domain_edges.find().forEach(function(edge) {
    graphDB.nodes.find({string: edge._id.s}).forEach(function(sourceNode) {
        graphDB.nodes.find({string: edge._id.t}).forEach(function(targetNode) {

            var sourceID = sourceNode._id;
            var targetID = targetNode._id;

            if (!sourceID.equals(targetID)) {
                graphDB.edges.insert({
                    source: sourceNode._id,
                    target: targetNode._id,
                    type: "shared_domains",
                    domains: edge.value.domains,
                    domainCount: edge.value.domains.length
                });
            }
        });
    });
});

var insertAndFind = function(word, origin) {
    if (graphDB.nodes.count({string: word}) === 0) {
        graphDB.nodes.insert({
            string: word,
            language: "de",
            origin: origin
        });
    }
    return graphDB.nodes.find({string: word});
}

var upsertEdges = function(node1, node2, type) {

    var edge1 = {source: node1._id, target: node2._id, type: type}
    var edge2 = {source: node2._id, target: node1._id, type: type}

    graphDB.edges.update(edge1, edge1, {upsert: true});
    graphDB.edges.update(edge2, edge2, {upsert: true});
}

// integrate other wortschatz properties as edges
graphDB.nodes.find({wortschatzProperties: {$exists: true}}).forEach(function(sourceNode) {

    var synonyms = sourceNode.wortschatzProperties.synonyms.map(function(e) {
        return e.toLowerCase();
    });
    var thesaurus = sourceNode.wortschatzProperties.thesaurus.map(function(e) {
        return e.toLowerCase(); 
    });
    var wordforms = sourceNode.wortschatzProperties.wordforms.map(function(e) {
        return e.toLowerCase();
    });
    var baseforms = sourceNode.wortschatzProperties.baseforms.map(function(e) {
        return {word: e.word.toLowerCase(), type: e.type };
    });

    synonyms.forEach(function(synonym) {
        insertAndFind(synonym, "synonym").forEach(function(targetNode) {
            upsertEdges(sourceNode, targetNode, "synonym");
        });
    });

    thesaurus.forEach(function(thesaurusWord) {
        insertAndFind(thesaurusWord, "thesaurus").forEach(function(targetNode) {
            upsertEdges(sourceNode, targetNode, "thesaurus");
        });
    });

    wordforms.forEach(function(wordform) {
        insertAndFind(wordform, "wordform").forEach(function(targetNode) {
            upsertEdges(sourceNode, targetNode, "wordform");
        });
    });

    baseforms.forEach(function(baseform) {
        insertAndFind(baseform.word, "baseform").forEach(function(targetNode) {
            var edge = {source: sourceNode._id, target: targetNode._id, type: "baseform"}
            graphDB.edges.update(edge, edge, {upsert: true});
        });
    });
});


// remove self-referencing edges
db.edges.remove({$where: "this.source.equals(this.target)"});
