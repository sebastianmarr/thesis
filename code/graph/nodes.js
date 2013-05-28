db.ss_tag_link_object.ensureIndex({tag_id: 1})
db.mr_orders_per_tag.find().forEach(function(tag) {
    
    // create node
    node = {
         _id: tag.tag_id,
        lang: tag.lang,
         tag: tag.tag,
        occs: db.ss_tag_link_object.count({tag_id: tag.tag_id})
    }

    db.tag_graph_nodes.insert(node)
})