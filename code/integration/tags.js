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

  var integratedNode = {
    string: tagNode.tag,
    language: tagNode.lang,
    tagProperties: tagProperties
  };

  graphDB.nodes.insert(integratedNode);
}

// integrate edges
tagDB.edges_tags.find().forEach(importEdge);

function importEdge(edge) {

  // get source and target node
  var source = tagDB.nodes_tags.findOne({_id: edge.s});
  var target = tagDB.nodes_tags.findOne({_id: edge.t});

  var integratedSource = graphDB.nodes.findOne({string: source.tag, language: source.lang});
  var integratedTarget = graphDB.nodes.findOne({string: target.tag, language: target.lang});

  var integratedEdge = {
    source: integratedSource._id,
    target: integratedTarget._id,
    type: 'tag-co-occurence',
    occurences: edge.occs,
    dice: edge.dice,
    jaccard: edge.jaccard,
    cosine: edge.cosine
  };

  graphDB.edges.insert(integratedEdge);
}