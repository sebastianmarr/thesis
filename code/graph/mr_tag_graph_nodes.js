var map = function() {
    emit(
        {t: this._id.t, l: this._id.l},
        {
            occs: 1,
            tag: this._id.t,
            lang: this._id.l,
            links: [{oid: this._id.oid, ot: this._id.ot}]
        }
    );
}

var reduce = function(key, values) {
    var r = {
        occs: 0,
        tag: key.t,
        lang: key.l,
        links: []
     };

     return values.reduce(function(memo, value) {

        if (value.occs) {
            memo.occs += value.occs;
        }

        if (value.links) {
            memo.links = memo.links.concat(value.links);
        }

        return memo;

     }, r);
}

db.mr_tag_nodes.drop();
db.mr_dedup.mapReduce(map, reduce, {out: {merge: "mr_tag_nodes"}});

// insert them into collection to get a "real" _id and be able to shard and build edges out of them (faster)
db.mr_tag_nodes.find().forEach(function(node) {
    db.nodes_tags.insert(node.value);
});

sh.shardCollection("marr_fulldump.nodes_tags", {_id: 1});