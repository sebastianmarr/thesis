// build edges for mcl

db.mcl_edges.drop()
db.mcl_edges.ensureIndex({a: 1, b: 1})
db.tag_graph_edges.find().addOption(DBQuery.Option.noTimeout).forEach(function(edge) {
    var a = db.tag_graph_nodes.findOne({_id: edge._id}).tag
    edge.tn.forEach(function(t) {
        var b = db.tag_graph_nodes.findOne({_id: t.id}).tag
        if (db.mcl_edges.count({$or: [{a: a, b: b}, {a: b, b: a}]}) == 0) {
            db.mcl_edges.insert({
                a: a,
                b: b,
                c: t.ochiai
            })
        }
    })
})
