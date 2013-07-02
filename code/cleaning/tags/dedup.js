var map = function() {

    var t = this._id.t;
    var l = this._id.l;

    this.value.o.forEach(function(o) {
        emit({
            t: t,
            l: l,
            oid: o.oid,
            ot: o.ot
        }, null);
    });
}

var reduce = function(key, values) {
    return values[0];
}

db.mr_dedup.drop();
db.mr_tags.mapReduce(map, reduce, {out: {replace: "mr_dedup", sharded: false}});
