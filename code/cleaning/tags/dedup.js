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
