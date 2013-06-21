// To be executed against the workspace, e.g.
// $ mongo workspace buildClickGraph.js
// (assuming the db is on localhost).

print("Building Click Co-Occurence Graph from clicks collection...\n");

print("Cleanup...");
load('cleaning/clicks/cleanup.js');
print("Done.\n");

print("Nodes...")
load('graph/clicks/nodes.js');
print("Done.\n");


print("Edges...");
load('graph/clicks/edges.js');
print("Done.\n");

print("Measures...");
load('graph/clicks/measures.js');
print("Done.\n");
