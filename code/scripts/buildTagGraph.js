// To be executed against the workspace, e.g.
// $ mongo workspace scripts/buildClickGraph.js
// (assuming the db is on localhost).

// requires the clicks collection

var scripts = [
    'cleaning/tags/sanitize.js',
    'cleaning/tags/join.js',
    'cleaning/tags/dedup.js'.
    'graph/tags/nodes.js',
    'graph/tags/edges.js',
    'graph/tags/measures.js'
]

scripts.forEach(function(script_path) {
    print(script_path.split('/').pop().slice(0, -3));
    load(script_path);
});
