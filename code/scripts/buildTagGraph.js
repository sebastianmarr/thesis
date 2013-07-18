// To be executed against an imported opossum db, either spreadshirt_net oder spreadshirt_com
// Need ss_tags and ss_tag_link_object

var scripts = [
    'cleaning/tags/sanitize.js',
    'cleaning/tags/join.js',
    'cleaning/tags/dedup.js',
    'graph/tags/nodes.js',
    'graph/tags/edges.js',
    'graph/tags/measures.js'
]

scripts.forEach(function(script_path) {
    print(script_path.split('/').pop().slice(0, -3));
    load(script_path);
});
