// transform nodes to get occurences of tags together
var map = function() {

    var id = this._id;
    var occs = this.value.occs;

    this.value.links.forEach(function(link) {

        emit(
            link.ot + '_' + link.oid,
            {t: [{i: id, o: occs}]}
        );
    });
}

var reduce = function(key, values) {

    return values.reduce(function(memo, value) {

        if (value.t) {
            memo.t = memo.t.concat(value.t);
        }

        return memo;

    }, {t: []});
}

db.mr_tag_co_occs.drop();
db.nodes_tags.mapReduce(
    map,
    reduce,
    {
        out: {
            replace: "mr_tag_co_occs",
            sharded: true
        }
    }
);

// build stripes
var map = function() {

    var t = this.value.t;

    t.forEach(function(tag) {
        tag_id = tag.i;
        t.forEach(function(other_tag) {
            other_tag_id = other_tag.i;
            if (tag_id != other_tag_id) {
                emit({s: tag_id, t: other_tag_id}, {occs: 1, s_occs: tag.o, t_occs: other_tag.o});
            }
        });
    });
}

var reduce = function(key, values) {

    var s_occs = values[0].s_occs;
    var t_occs = values[0].t_occs;

    var reduction = values.reduce(function(memo, value) {
        if (value.occs) {
            memo.occs += value.occs;
        }
        return memo;
    }, {occs: 0, s_occs: s_occs, t_occs: t_occs});

    return reduction;
}

db.mr_edges_tags.drop();
db.mr_tag_co_occs.mapReduce(
    map,
    reduce,
    {
        out: {
            merge: "mr_edges_tags"
        }
    }
);
