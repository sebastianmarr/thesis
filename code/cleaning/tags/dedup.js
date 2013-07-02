var map = function() {
    emit(
        {t: this.value.t, l: this.value.l},
        {o: this.value.o}
    );
}

var reduce = function(key, values) {
    

    var allLinks = values.reduce(function(memo, value) {

        return memo.concat(value.o);

    }, []);

    return {
        o: allLinks
    };
}

db.mr_dedup.drop();
db.mr_tags.mapReduce(map, reduce, {out: {replace: "mr_dedup", sharded: true}});

// dedup the links by flattening everything
var map = function() {

    var t = this._id.t;
    var l = this._id.l;

    this.value.o.forEach(function(link) {

        emit({
            t: t,
            l: l,
            oid: link.oid,
            ot: link.ot
        }, null);

    });
}

var reduce = function(key, values) {
    return values[0];
}

db.mr_flattened.drop();
db.mr_dedup.mapReduce(map, reduce, {out: {replace: "mr_flattened", sharded: true}});
