// look for duplicate tags (just different case) and delete them after 
// replacing all references to them with the canonical one

// remove all tags that are never referenced
db.ss_tag_link_object.ensureIndex({"tag_id": true})
db.ss_tags.find().toArray().forEach(function(tag) {
    if (db.ss_tag_link_object.count({"tag_id": tag.tag_id}) == 0) {
        db.ss_tags.remove({_id: tag._id})
    }
})

// merge duplicate tags
db.ss_tags.ensureIndex({"tag": true, "lang": true})
db.ss_tags.ensureIndex({"tag_id": true})
db.ss_tags.find().addOption(DBQuery.Option.noTimeout).forEach(function(tag) {
    db.ss_tags.find(
        {"tag": tag.tag, "lang": tag.lang, "tag_id": {$ne: tag.tag_id}}
    ).forEach(function(duplicate) {
        db.ss_tag_link_object.update(
            {"tag_id": duplicate.tag_id},
            {$set: {"tag_id": tag.tag_id}},                
            {multi: true}
        )
        db.ss_tags.remove({tag_id: duplicate.tag_id})
    })
})

// remove duplicates in ss_tag_link_object by creating a unique composite index on
// tag_id, object_id and object_type_id,
// enforcing the build of the index by dropping duplicates
db.ss_tag_link_object.ensureIndex(
    {"tag_id": 1, "object_id": 1, "object_type_id": 1},
    {unique: true, dropDups: true}
) 
