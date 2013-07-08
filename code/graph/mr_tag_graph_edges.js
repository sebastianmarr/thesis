// transform nodes to get occurences of tags together
var map = function() {

    var id = this._id;

    this.links.forEach(function(link) {

        emit(
            link.ot + '_' + link.oid,
            {t: [id]}
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
db.nodes_tags.mapReduce(map, reduce, {out: {merge: "mr_tag_co_occs", sharded: true}, query: {"lang": "de"}});

// build stripes
var map = function() {

    var t = this.value.t;

    t.forEach(function(tag_id) {
        t.forEach(function(other_tag_id) {
            if (tag_id != other_tag_id) {
                emit({s: tag_id, t: other_tag_id}, {occs: 1});
            }
        });
    });
}

var reduce = function(key, values) {

    var reduction = values.reduce(function(memo, value) {
        if (value.occs) {
            memo.occs += value.occs;
        }
        return memo;
    }, {occs: 0});

    return reduction;
}

db.mr_edges_tags.drop();
db.mr_tag_co_occs.mapReduce(map, reduce, {out: {merge: "mr_edges_tags"}});
