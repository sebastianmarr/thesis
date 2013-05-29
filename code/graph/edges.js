// first step: just record co-occurences

db.links.ensureIndex({tag_id: 1})
db.links.ensureIndex({object_type_id: 1})
db.links.ensureIndex({object_id: 1})
db.links.ensureIndex({object_type_id: 1, object_id: 1})
db.links.ensureIndex({object_type_id: 1, object_id: 1, tag_id: 1})
db.tag_graph_nodes.find({},{_id: 1, occs: 1}).addOption(DBQuery.Option.noTimeout).forEach(function(node) {

    var temp_tn = {}

    var edge = {
        _id: node._id,
        tn: []
    }

    db.links.find(
        {tag_id: node._id},
        {object_type_id: 1, object_id: 1}
    ).forEach(function(object_with_node_tag) {

        db.links.find(
            {
                object_type_id: object_with_node_tag.object_type_id,
                object_id: object_with_node_tag.object_id,
                tag_id: {$ne: node._id}},
            {tag_id: 1}
        ).forEach(function(other_tag) {
            
            // check if the target node is in the graph
            if (temp_tn[other_tag.tag_id]) {
                temp_tn[other_tag.tag_id] ++
            } else {
                temp_tn[other_tag.tag_id] = 1
            }
        })
    })

    for (var e in temp_tn) {
        edge.tn.push({
            id: parseInt(e),
            occs: temp_tn[e]
        })
    }

    db.tag_graph_edges.insert(edge)
})
