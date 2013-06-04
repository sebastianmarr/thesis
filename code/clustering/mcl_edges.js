// build edges for mcl

db.mcl_edges.drop()
db.mcl_edges.ensureIndex({a: 1, b: 1})
db.tag_graph_edges.find().addOption(DBQuery.Option.noTimeout).forEach(function(edge) {
    edge.tn.forEach(function(t) {
        if (db.mcl_edges.count({$or: [{a: edge._id, b: t.id}, {a: t.id, b: edge._id}]}) == 0) {
            db.mcl_edges.insert({
                a: edge._id,
                b: t.id,
                c: t.ochiai
            })
        }
    })
})
