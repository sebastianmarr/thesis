var graphDB =  db.getSiblingDB('graph');
var wortschatzDB = db.getSiblingDB('wortschatz');

var insertAndFind = function(word) {
    if (graphDB.nodes.count({string: word}) === 0) {
        graphDB.nodes.insert({
            string: word,
            language: "de",
            singleWord: true
        });
    }
    return graphDB.nodes.find({string: word, singleWord: true});
}

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
        insertAndFind(synonym).forEach(function(targetNode) {
            graphDB.edges.insert({source: sourceNode._id, target: targetNode._id, type: "synonym"});
        });
    });

    thesaurus.forEach(function(thesaurusWord) {
        insertAndFind(thesaurusWord).forEach(function(targetNode) {
            graphDB.edges.insert({source: sourceNode._id, target: targetNode._id, type: "thesaurus"});
        });
    });

    wordforms.forEach(function(synonym) {
        insertAndFind(synonym).forEach(function(targetNode) {
            graphDB.edges.insert({source: sourceNode._id, target: targetNode._id, type: "wordform"});
        });
    });

    baseforms.forEach(function(baseform) {
        insertAndFind(baseform.word).forEach(function(targetNode) {
            graphDB.edges.insert({source: sourceNode._id, target: targetNode._id, type: "baseform"});
        });
    });
});

// remove self-referencing edges
db.edges.remove({$where: "this.source.equals(this.target)"});
