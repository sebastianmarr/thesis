// dedup clicks (unique articles per query)

var map = function() {

    var query = this.value.query;
    var platform = this.value.platform;
    var language = this.value.language;
    var articleId = this.value.articleId;

    emit({
        q: query,
        p: platform,
        l: language,
        a: articleId
    }, 1);
}

var reduce = function(key, values) {
    return values[0];
}

db.mr_clicks_dedup.drop();
db.mr_clicks_sanitized.mapReduce(
    map,
    reduce,
    {
        out: {
            reduce: "mr_clicks_dedup",
            sharded: true
        }
    }
);
