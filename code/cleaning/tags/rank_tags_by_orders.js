// extract article tags per orderitem
db.ss_order_orderitems.ensureIndex({article_id: 1})
db.ss_tag_link_object.ensureIndex({object_type_id: 1, object_id: 1})

db.ss_order_orderitems.update({}, {$unset: {a_tags: 1}, {multi: true}})
db.ss_order_orderitems.update({}, {$unset: {d_tags: 1}, {multi: true}})

db.ss_order_orderitems.find({article_id: {$ne: 0}}, {article_id: 1}).addOption(DBQuery.Option.noTimeout).forEach(function(orderitem) {
    var article_tags = db.ss_tag_link_object.find(
        {object_type_id: 3, object_id: orderitem.article_id},
        {tag_id: 1}
    ).map(function(article_tag) { return article_tag.tag_id })
    db.ss_order_orderitems.update(
        {_id: orderitem._id},
        {$push: {a_tags: {$each: article_tags}}}
    )
})

// extract design tags per orderitem
db.ss_order_orderitems.ensureIndex({product_id: 1})
db.ss_productng_configurations.ensureIndex({product_id: 1, type: 1})
db.ss_tag_link_object.ensureIndex({object_type_id: 1, object_id: 1})
db.ss_order_orderitems.find({product_id: {$ne: 0}}, {product_id: 1}).addOption(DBQuery.Option.noTimeout).forEach(function(orderitem) {
    db.ss_productng_configurations.find(
        {product_id: orderitem.product_id, type: "design"},
        {design_id: 1}
    ).forEach(function(configuration) {
        var design_tags = db.ss_tag_link_object.find(
            {object_type_id: 4, object_id: configuration.design_id},
            {tag_id: 1}
        ).map(function(design_tag) { return design_tag.tag_id })
        db.ss_order_orderitems.update(
            {_id: orderitem._id},
            {$push: {d_tags: {$each: design_tags}}}
        )
    })
})

// map reduce to count sales of tags
var map = function() {
    if (this.a_tags) {
        this.a_tags.forEach(function(tag) {
            emit(tag, 1)
        })
    }
    if (this.d_tags) {
        this.d_tags.forEach(function(tag) {
            emit(tag, 1)
        })
    }
}

var reduce = function(key, values) {
    return Array.sum(values)
}

db.ss_order_orderitems.mapReduce(map, reduce, {out: "mr_orders_per_tag"})
