// integrate wortschatz domain edges based on full text search
var cur = wortschatzDB.mr_domain_edges.find().addOption(DBQuery.Option.noTimeout);
var currentEdge = 0;
var totalEdges = cur.count();

cur.forEach(function(domainEdge) {

   var sourceString = domainEdge._id.s;
   var targetString = domainEdge._id.t;

   // volltextsuche nach auf wort matchenden nodes
   var treshold = 0.7;
   var sourceNodes = graphDB.nodes.runCommand("text", {search: sourceString, limit: 1000000}).results
   sourceNodes = sourceNodes.filter(function(result) { return result.score >= treshold });
   var targetNodes = graphDB.nodes.runCommand("text", {search: targetString, limit: 1000000}).results
   targetNodes = targetNodes.filter(function(result) { return result.score >= treshold });

   sourceNodes.forEach(function(source) {
    targetNodes.forEach(function(target) {

        var edge = {
            source: source.obj._id,
            target: target.obj._id,
            type: "shared_domains",
            sourceWord: sourceString,
            sourceMatch: source.score,
            targetWord: targetString,
            targetMatch: target.score,
            domains: domainEdge.value.domains,
            domainCount: domainEdge.value.domains.length
        }

        graphDB.edges.insert(edge);
    });
   });

   currentEdge++;
   if (currentEdge % 1000 === 0) {
      print(currentEdge + "/" + totalEdges + " processed");
   }
});
