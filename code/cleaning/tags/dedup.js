// look for duplicate tags (after sanitizing) and delete them after 
// replacing all references to them with the canonical one

// MR to count occurences per tag in language
var map = function() {
    emit({tag: this.tag, lang: this.lang}, 1)
}

var reduce = function(key, values) {
    return Array.sum(values)
}

db.ss_tags.mapReduce(map, reduce, {out: "mr_duplicate_tags"})

// remove duplicates by merging tags
db.ss_tags.ensureIndex({tag:1, lang:1})
db.ss_tag_link_object.ensureIndex({tag_id: true})
db.mr_duplicate_tags.find({value:{$gt:1}}).toArray().forEach(function(dups) {

    var tags = db.ss_tags.find(dups._id).toArray()
    var canonical = tags[0]
    for (var i = tags.length - 1; i >= 1; i--) {
        var dup = tags[i]
        db.ss_tag_link_object.update(
            {tag_id: dup.tag_id},
            {$set: {tag_id: canonical.tag_id}},
            {multi: true}
        )
        db.ss_tags.remove(dup._id)
    }
})

// remove duplicate link entries after merging tags
var map = function() {
    emit({tag_id: this.tag_id, object_id: this.object_id, object_type_id: this.object_type_id}, 1)
}
var reduce = function(key, values) {
    return Array.sum(values)
}
db.ss_tag_link_object.mapReduce(map, reduce, {out: "mr_duplicate_tag_links"})

db.ss_tag_link_object.ensureIndex({tag_id:1, object_id:1, object_type_id:1})
db.mr_duplicate_tag_links.find({value:{$gt:1}}).toArray().forEach(function(dups) {
    var links = db.ss_tag_link_object.find(dups._id).toArray()
    for (var i = links.length - 1; i >= 1; i--) {
        var dup = links[i]
        db.ss_tag_link_object.remove(dup._id)
    };
})

// remove all tags that are never referenced
db.ss_tags.find().toArray().forEach(function(tag) {
    if (db.ss_tag_link_object.count({"tag_id": tag.tag_id}) == 0) {
        db.ss_tags.remove({_id: tag._id})
    }
})
