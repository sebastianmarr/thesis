// join all clicks for the same query and the same language together
var map = function() {

    emit(
        {q: this._id.q, l: this._id.l},
        {
            query: this._id.q,
            language: this._id.l,
            clicks: [{articleId: this._id.a, platform: this._id.p}]
        }
    );
}

var reduce = function(key, values) {
    return values.reduce(function(memo, value) {
        if (value.clicks && value.clicks.length > 0) {
            memo.clicks = memo.clicks.concat(value.clicks);
        }
        return memo;
    },
    {
        query: key.q,
        language: key.l,
        clicks: [],
    });
}

db.mr_clicks_joined.drop();
db.mr_clicks_dedup.mapReduce(map, reduce, {out: {merge: "mr_clicks_joined"}});
