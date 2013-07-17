// join all clicks for the same query and the same language together
var map = function() {

    emit(
        {q: this.value.query, l: this.value.language},
        {
            occs: 1,
            query: this.value.query,
            language: this.value.language,
            clicks: [{articleId: this.value.articleId, productId: this.value.productId, index: this.value.index}]
        }
    );
}

var reduce = function(key, values) {
    return values.reduce(function(memo, value) {
        if (value.occs) {
            memo.occs += value.occs;
        }
        if (value.clicks && value.clicks.length > 0) {
            memo.clicks = memo.clicks.concat(value.clicks);
        }
        return memo;
    },
    {
        occs: 0,
        query: key.q,
        language: key.l,
        clicks: []
    });
}

db.mr_clicks_joined.drop();
db.mr_clicks_sanitized.mapReduce(map, reduce, {out: {merge: "mr_clicks_joined"}});
