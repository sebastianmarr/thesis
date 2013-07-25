var tagDB = db.getSiblingDB('german_tag_graph');
var graphDB =  db.getSiblingDB('graph');

// integrate nodes
tagDB.nodes_tags.find().forEach(importNode);

function importNode(tagNode) {

  var designIDs = tagNode.links.filter(function(link) { return link.ot === 4; }).map(function(link) { return link.oid });
  var articleIDs = tagNode.links.filter(function(link) { return link.ot === 3; }).map(function(link) { return link.oid });

  var tagProperties = {
    occurenceCount: tagNode.occs,
    articleCount: tagNode.articleCount,
    designCount: tagNode.designCount,
    articleIDs: articleIDs,
    designIDs: designIDs
  };

  graphDB.nodes.update(
    {
      _id: tagNode._id,
      string: tagNode.tag,
      language: tagNode.lang
    },
    {$set: {tagProperties: tagProperties}},
    {upsert: true}
  );
}

// integrate edges
tagDB.edges_tags.find().forEach(importEdge);

function importEdge(edge) {
  
  var integratedEdge = {
    source: edge.s,
    target: edge.t,
    type: 'tag-co-occurence',
    occurences: edge.occs,
    dice: edge.dice,
    jaccard: edge.jaccard,
    cosine: edge.cosine
  };

  graphDB.edges.insert(integratedEdge);
}