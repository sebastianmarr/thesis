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
