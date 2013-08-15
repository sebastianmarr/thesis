var map = function() {

    // emit pairs of words
    var words = this.value.words;
    var domain = this._id;

    words.forEach(function(word) {
        words.forEach(function(otherWord) {
            if (word !== otherWord) {
                emit(
                    {s: word, t: otherWord},
                    {domains: [domain]}
                );
            }
        });
    });
}

var reduce = function(key, values) {

    return values.reduce(function(ret, value) {

        ret.domains = ret.domains.concat(value.domains);

        return ret;

    }, {domains: []});
}

db.mr_domain_edges.drop();
db.mr_domain_co_occurences.mapReduce(map, reduce, {out: {replace: "mr_domain_edges"}});
