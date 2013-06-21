load('graph/nodes.js')

db.tmp_links_subset.ensureIndex({tag_id: 1})
db.tmp_tags_subset.ensureIndex({tag_id: 1})

ids = db.tmp_tags_subset.find({},{tag_id: 1}).toArray().map(function(x) { return x.tag_id });

occs = function(nodeId) {
    return db.tmp_links_subset.count({tag_id: nodeId});
};

props = function(nodeId) {
    var tag = db.tmp_tags_subset.findOne({tag_id: nodeId}, {lang: 1, tag: 1});
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
