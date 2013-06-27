var map = function() {
    var key = this.value.t + "_" + this.value.l;
    emit(key, {o: this.value.o});
}

var reduce = function(key, values) {
    r = {o: []};

    values.forEach(function(value) {
        value.o.forEach(function(link) {
            var exists = r.o.some(function(x){ return x.ot === link.ot && x.oid === link.oid });
            if (!exists) {
                r.o.push(link);
            }
        });
    });

    return r;
}

db.mr_dedup.drop();
db.mr_tags.mapReduce(map, reduce, {out: {replace: "mr_dedup", sharded: true}});
