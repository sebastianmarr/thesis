db.nodes.ensureIndex({string: 1, language: 1}, {unique: true});
db.nodes.ensureIndex({language: 1, string: 1}, {unique: true});

db.edges.ensureIndex({source: 1, type: 1, target: 1}, {unique: true});
db.edges.ensureIndex({type: 1});
db.edges.ensureIndex({target: 1});
