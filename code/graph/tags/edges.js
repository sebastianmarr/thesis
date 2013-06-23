load('graph/edges.js');

db.links_subset.ensureIndex({tag_id: 1})
db.links_subset.ensureIndex({object_type_id: 1, object_id: 1})
db.links_subset.ensureIndex({object_type_id: 1, object_id: 1, tag_id: 1})


neighbors = function(nodeId) {

    var ret = [];

    db.links_subset.find(
        {tag_id: nodeId},
        {object_type_id: 1, object_id: 1}
    ).forEach(function(object_with_tag) {

        db.links_subset.find(
            {
                object_type_id: object_with_tag.object_type_id,
                object_id: object_with_tag.object_id,
                tag_id: {$ne: nodeId}
            },
            {tag_id: 1}
        ).forEach(function(other_tag) {
            ret.push(other_tag.tag_id);
        });
    });

    return ret;
};


buildEdges(
    db.tag_graph_nodes,
    db.tag_graph_edges,
    neighbors
);
