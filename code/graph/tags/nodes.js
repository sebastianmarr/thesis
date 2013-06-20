load('../nodes.js')

db.links.ensureIndex({tag_id: 1})
db.tags.ensureIndex({tag_id: 1})

ids = db.tags.find({},{tag_id: 1}).toArray().map(function(x) { return x.tag_id });

occs = function(nodeId) {
    return db.links.count({tag_id: nodeId});
};

props = function(nodeId) {
    var tag = db.tags.findOne({tag_id: nodeId}, {lang: 1, tag: 1});
    return {
        tag: tag.tag,
        lang: tag.lang
    };
};

buildNodes(
    ids,
    occs,
    props,
    db.tag_graph_nodes
);
