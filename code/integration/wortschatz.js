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

// integrate synonyms
graphDB.nodes.find({"wortschatzProperties.synonyms": {$exists: true}}).forEach(function(node) {
    var syns = node.wortschatzProperties.synonyms;
    if (syns.length > 0) {
        syns.forEach(function(synonym) {
            graphDB.nodes.find({string: synonym.toLowerCase()}).forEach(function(otherNode) {
                var edge = {
                    source: node._id,
                    target: otherNode._id,
                    type: "synonym"
                }
                graphDB.edges.insert(edge);
            });
        });
    }
});

// integrate wordforms
graphDB.nodes.find({"wortschatzProperties.wordforms": {$exists: true}}).forEach(function(node) {
    var forms = node.wortschatzProperties.wordforms;
    if (forms.length > 0) {
        forms.forEach(function(f) {
            var form = f.toLowerCase();
            if (form !== node.string) {

                // insert word if it doesn't exist
                if (graphDB.nodes.count({string: form}) === 0) {
                    graphDB.nodes.insert({
                        string: form,
                        language: "de",
                        singleWord: true
                    })
                }

                graphDB.nodes.find({string: form, singleWord: true}).forEach(function(formNode) {
                    graphDB.edges.insert({
                        source: node._id,
                        target: formNode._id,
                        type: "wordform"
                    });
                });
            }
        });
    }
});

// integrate baseforms
graphDB.nodes.find({"wortschatzProperties.baseforms": {$exists: true}}).forEach(function(node) {
    baseforms = node.wortschatzProperties.baseforms.map(function(element){ return element.word.toLowerCase() });
    if (baseforms.length > 0) {
        baseforms.filter(function(element) { return element !== node.string }).forEach(function(baseform) {
            // insert word if it doesn't exist
            if (graphDB.nodes.count({string: baseform}) === 0) {
                graphDB.nodes.insert({
                    string: baseform,
                    language: "de",
                    singleWord: true
                })
            }
            graphDB.nodes.find({string: baseform, singleWord: true}).forEach(function(baseformNode) {
                    graphDB.edges.insert({
                        source: node._id,
                        target: baseformNode._id,
                        type: "baseform"
                    });
                });
        });
    }
});
