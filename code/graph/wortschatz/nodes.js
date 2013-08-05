var map = function() {

    // baseforms
    var b = [];
    if (this.baseform) {
        for (var i = 0; i <= this.baseform.length - 1; i+= 2) {
            b.push({
                word: this.baseform[i],
                type: this.baseform[i+1]

            })
        };
    }

    // wordforms


    emit(
        this.string.toLowerCase(),
        {
            baseforms: b || [],
            domains: this.domain || [],
            wordforms: this.wordforms || [],
            thesaurus: this.thesaurus || []
        }
    );
}

var reduce = function(key, values) {

    return values.reduce(function(ret, value) {

        value.baseforms.forEach(function(baseform) {

            if (!ret.baseforms.some(function(x) {
                return x.word == baseform.word && x.type == baseform.type;
            })) {
                ret.baseforms.push(baseform);
            }
        });

        value.domains.forEach(function(domain) {
            if (ret.domains.indexOf(domain) < 0) {
                ret.domains.push(domain);
            }
        });

        value.wordforms.forEach(function(domain) {
            if (ret.wordforms.indexOf(domain) < 0) {
                ret.wordforms.push(domain);
            }
        });

        value.thesaurus.forEach(function(domain) {
            if (ret.thesaurus.indexOf(domain) < 0) {
                ret.thesaurus.push(domain);
            }
        });

        return ret;

    }, {
        baseforms: [],
        domains: [],
        wordforms: [],
        thesaurus: []
    });
}

db.mr_nodes.drop();
db.words.mapReduce(map, reduce, {out: {replace: "mr_nodes"}});
