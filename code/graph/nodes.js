db.links.ensureIndex({tag_id: 1})
db.tags.ensureIndex({"tag_id": 1})
db.tag_graph_nodes.drop()
db.tags.find().forEach(function(tag) {
    
    // create node
    node = {
         _id: tag.tag_id,
        lang: tag.lang,
         tag: tag.tag,
        occs: db.links.count({tag_id: tag.tag_id})
    }

    db.tag_graph_nodes.insert(node)
})
