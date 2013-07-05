// flatten tags and links to find unique combinations (dedup tags and links at the same time)
var map = function() {

    var t = this.value.t;
    var l = this.value.l;

    this.value.o.forEach(function(o) {
        emit({
            t: t,
            l: l,
            oid: o.oid,
            ot: o.ot
        }, 1);
    });
}

var reduce = function(key, values) {
    return values[0];
}

db.mr_dedup.drop();
db.mr_tags.mapReduce(map, reduce, {out: {merge: "mr_dedup"}});
