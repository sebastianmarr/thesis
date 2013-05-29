// this extraxts all german tags that have at least one sale

db.tags.drop()
db.links.drop()

db.mr_orders_per_tag.ensureIndex({"tag.lang": 1})
db.mr_orders_per_tag.find({"tag.lang": "de"}).addOption(DBQuery.Option.noTimeout).forEach(function(tag) {

    db.tags.insert(tag.tag)
    db.ss_tag_link_object.find({"tag_id": tag._id}).forEach(function(link) {
        db.links.insert(link)
    })
})
