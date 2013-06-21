db.ss_tags_subset.drop();
db.tmp_links_subset.drop();

sh.shardCollection('workspace.tmp_links_subset', {_id: 1});
sh.shardCollection('workspace.ss_tags_subset', {_id: 1});

db.ss_tags.ensureIndex({tag_id: 1});
db.ss_tag_link_object.ensureIndex({tag_id: 1});

db.ss_tag_link_object.remove({tag_id: 0})
db.mr_orders_per_tag.remove({_id: 0})

db.mr_orders_per_tag.find().addOption(DBQuery.Option.noTimeout).forEach(function(mr) {
    var tag = db.ss_tags.findOne({tag_id: mr._id});
    if (tag.lang == "de") {
        db.ss_tags_subset.insert(tag);
        db.ss_tag_link_object.find({tag_id: tag.tag_id}).forEach(function(link) {
            db.tmp_links_subset.insert(link);
        });
    }
});
