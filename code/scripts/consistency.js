db.edges.ensureIndex({source: 1, _id: 1});
db.edges.ensureIndex({target: 1, _id: 1});

// remove unused nodes with no special properties
var count = 0;
db.nodes.find().forEach(function(node) {
    if (db.edges.count({$or: [{source: node._id}, {target: node._id}]}) === 0) {
        if (!node.languageDetection && !node.tagProperties && !node.clickProperties && !node.wortschatzProperties) { 
            db.nodes.remove({_id: node._id}); 
            count++;
            print("" + count + " nodes removed!");
        }
    };
});


// remove edges pointing at non-existing nodes
var count = 0;
db.edges.find().forEach(function(edge) {

    var sCount = db.nodes.count({_id: edge.source});
    var tCount = db.nodes.count({_id: edge.target});

    if (sCount + tCount !== 2) {
        count++;
        db.edges.remove({_id: edge._id});
        print("" + count + " edges removed");
    }
});
