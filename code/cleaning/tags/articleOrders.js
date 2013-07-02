var mapDedupedTags = function() {

    var tag = this._id.t;
    var lang = this._id.l;

    this.value.o.forEach(function(objectLink) {
        if (objectLink.ot === 3) {
            emit(
             objectLink.oid,
             {
                t: [{t: tag, l: lang}],
                }
            );
        }
    });
}

var mapOrderItems = function() {
    emit(
        this.article_id,
        {
            o: 1
        }
    );
}

var reduce = function(key, values) {

    var r = values.reduce(function(memo, value) {

        if (value.t) {
            memo.t = memo.t.concat(value.t);
        }

        if (value.o) {
            memo.o += value.o;
        }

        return memo;

    }, {t: [], o: 0});

    return r;
}

db.mr_article_tags_orders.drop();
db.mr_dedup.mapReduce(mapDedupedTags, reduce, {out: {replace: "mr_article_tags_orders", sharded: true}});
db.ss_order_orderitems.mapReduce(mapOrderItems, reduce, {out: {reduce: "mr_article_tags_orders", sharded: true}, query: {article_id:{$ne:0}}});

// clean up articles without tags, tags without articles
db.mr_article_tags_orders.remove({"value.t":{$not:{$exists:1}}});
db.mr_article_tags_orders.remove({"value.o":{$not:{$exists:1}}});
// remove articles without orders
db.mr_article_tags_orders.remove({"value.o":0});
