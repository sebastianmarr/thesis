var excludedDomains = ["Nachname", "Vorname"];

var map = function() {

    var key = this.string.toLowerCase();

    // domains
    var domains = [];
    if (this.domain) {
        domains = this.domain.filter(function(domain) { return excludedDomains.indexOf(domain) < 0; });
    }

    // baseforms
    var baseforms = [];
    if (this.baseform) {
        for (var i = 0; i <= this.baseform.length - 1; i+= 2) {
            baseforms.push({
                word: this.baseform[i],
                type: this.baseform[i+1]

            })
        }
    }

    // wordforms
    var wordforms = this.wordforms || [];

    // thesaurus
    var thesaurus = this.thesaurus || [];

    // synonyms
    var synonyms = this.synonyms || [];


    emit(key, { baseforms: baseforms, domains: domains, wordforms: wordforms, thesaurus: thesaurus, synonyms: synonyms });
}

var reduce = function(key, values) {

    var reducedValue = { baseforms: [], domains: [], wordforms: [], thesaurus: [], synonyms: [] };

    return values.reduce(function(ret, value) {


        ret.baseforms = ret.baseforms.concat(value.baseforms);
        ret.domains = ret.domains.concat(value.domains);
        ret.wordforms = ret.wordforms.concat(value.wordforms);
        ret.thesaurus = ret.thesaurus.concat(value.thesaurus);
        ret.synonyms = ret.synonyms.concat(value.synonyms);

        return ret;

    }, reducedValue);
}

var finalize = function(key, reducedValue) {

    // dedup baseforms
    var deduppedBaseForms = [];
    reducedValue.baseforms.forEach(function(baseform) {
        if (!deduppedBaseForms.some(function(alreadyThere) {
            return alreadyThere.word === baseform.word && alreadyThere.type === baseform.type;
        })) {
            deduppedBaseForms.push(baseform);
        }
    });
    reducedValue.baseforms = deduppedBaseForms;

    // dedup domains
    var deduppedDomains = [];
    reducedValue.domains.forEach(function(domain) {
        if (deduppedDomains.indexOf(domain) < 0) {
            deduppedDomains.push(domain);
        }
    });
    reducedValue.domains = deduppedDomains;

    // dedup wordforms
    var deduppedWordforms = [];
    reducedValue.wordforms.forEach(function(wordform) {
        if (deduppedWordforms.indexOf(wordform) < 0) {
            deduppedWordforms.push(wordform);
        }
    });
    reducedValue.wordforms = deduppedWordforms;

    // dedup thesaurus
    var deduppedThesaurus = [];
    reducedValue.thesaurus.forEach(function(thesaurusEntry) {
        if (deduppedThesaurus.indexOf(thesaurusEntry) < 0) {
            deduppedThesaurus.push(thesaurusEntry);
        }
    });
    reducedValue.thesaurus = deduppedThesaurus;

    // dedup synonyms
    var deduppedSynonyms = [];
    reducedValue.synonyms.forEach(function(synonym) {
        if (deduppedSynonyms.indexOf(synonym) < 0) {
            deduppedSynonyms.push(synonym);
        }
    });
    reducedValue.synonyms = deduppedSynonyms;


    return reducedValue;

}

db.mr_cleanup.drop();
db.words.mapReduce(map, reduce, {finalize: finalize, out: {replace: "mr_cleanup"}, scope: {excludedDomains: excludedDomains}});
