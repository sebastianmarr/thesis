var map = function() {

    var word = this._id;

    this.value.domains.forEach(function(domain) {
        if (domain) {
            emit(domain.toLowerCase(), {words: [word]});
        }
    });
}

var reduce = function(key, values) {

    return values.reduce(function(ret, value) {

        ret.words = ret.words.concat(value.words);
        return ret;

    }, {words: []});
}

db.mr_domain_co_occurences.drop();
db.mr_cleanup.mapReduce(map, reduce, {out: {replace: "mr_domain_co_occurences"}});
