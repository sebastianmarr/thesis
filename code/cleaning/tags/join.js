// join with tag_link_object
var map = function() {
    emit (
        this.tag_id,
        {
            o:[{
                ot: this.object_type_id,
                oid: this.object_id
            }]
        }
    );
}

var reduce = function(key, values) {

    var r = {t: null, l: null, o: []};

    values.forEach(function(value) {
        if (value.t) {
            r.t = value.t;
        }
        if (value.l) {
            r.l = value.l
        }
        if (value.o && value.o.length > 0) {
            r.o = r.o.concat(value.o);
        }
    });
    return r;
}

db.ss_tag_link_object.mapReduce(
    map,
    reduce,
    {
        out: {
            reduce: "mr_tags",
            sharded: true
        }
    }
);

// remove unreferenced and null tags
db.mr_tags.remove({"value.t": null});
db.mr_tags.remove({"value.l": null});
db.mr_tags.remove({"value.o": {$size: 0}});
db.mr_tags.remove({"value.o":{$not: {$exists:1}}});
