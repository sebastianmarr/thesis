// prepare language field based on original and google language

// tag nodes
graphDB.nodes.find({},{origLanguage: true, languageDetection: true}).forEach(function(node) {

    var language = node.origLanguage;

    if (node.languageDetection) {
        if (node.languageDetection.language !== "und") {
            if (node.origLanguage !== node.languageDetection.language) {
                if (node.languageDetection.confidence >= 0.4) {
                    language = node.languageDetection.language;
                }
            }
        }
    }

    graphDB.nodes.update({_id: node._id}, {$set: {language: language}});
});

// replace language labels
graphDB.nodes.update({language: "da"},{$set: {language: "danish"}},{multi: true});
graphDB.nodes.update({language: "nl"},{$set: {language: "dutch"}},{multi: true});
graphDB.nodes.update({language: "en"},{$set: {language: "english"}},{multi: true});
graphDB.nodes.update({language: "us"},{$set: {language: "english"}},{multi: true});
graphDB.nodes.update({language: "uk"},{$set: {language: "english"}},{multi: true});
graphDB.nodes.update({language: "fi"},{$set: {language: "finnish"}},{multi: true});
graphDB.nodes.update({language: "fr"},{$set: {language: "french"}},{multi: true});
graphDB.nodes.update({language: "de"},{$set: {language: "german"}},{multi: true});
graphDB.nodes.update({language: "hu"},{$set: {language: "hungarian"}},{multi: true});
graphDB.nodes.update({language: "it"},{$set: {language: "italian"}},{multi: true});
graphDB.nodes.update({language: "no"},{$set: {language: "norwegian"}},{multi: true});
graphDB.nodes.update({language: "pt"},{$set: {language: "portuguese"}},{multi: true});
graphDB.nodes.update({language: "ro"},{$set: {language: "romanian"}},{multi: true});
graphDB.nodes.update({language: "ru"},{$set: {language: "russian"}},{multi: true});
graphDB.nodes.update({language: "es"},{$set: {language: "spanish"}},{multi: true});
graphDB.nodes.update({language: "se"},{$set: {language: "swedish"}},{multi: true});
graphDB.nodes.update({language: "tr"},{$set: {language: "turkish"}},{multi: true});

graphDB.nodes.ensureIndex({string: "text"});
