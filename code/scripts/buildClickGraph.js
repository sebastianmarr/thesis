// To be executed against the workspace, e.g.
// $ mongo workspace scripts/buildClickGraph.js
// (assuming the db is on localhost).

// requires the clicks collection

var scripts = [
    'cleaning/clicks/cleanup.js',
    'cleaning/clicks/dedup.js',
    'cleaning/clicks/join.js',
    'graph/clicks/nodes.js',
    'graph/clicks/edges.js',
    'graph/clicks/measures.js'
]

scripts.forEach(function(script_path) {
    print(script_path.split('/').pop().slice(0, -3));
    load(script_path);
});
