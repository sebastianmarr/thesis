library(lattice)

tagging <- edges_per_node[edges_per_node$value.origin == "tag",c(1,3)]

clicktracking <- edges_per_node[edges_per_node$value.origin == "click" | edges_per_node$value.origin == "tag",c(1,3,4)]
clicktracking$step_edges <- clicktracking$value.tag_edges + clicktracking$value.click_edges

decomposition <- edges_per_node[edges_per_node$value.origin == "click" | edges_per_node$value.origin == "tag" | edges_per_node$value.origin == "decomposition",c(1,3,4,5)]
decomposition$step_edges <- decomposition$value.tag_edges + decomposition$value.click_edges + decomposition$value.decomposition_edges

histogram(~value.tag_edges, data = tagging, scales=(list(x=list(log=TRUE, limits=c(-1,20000), labels=c("0","1","10","100","1000","10000")))), xlab="Anzahl der ausgehenden Kanten", ylab="Prozent der Knotenmenge", col="grey", ylim=c(0,28), breaks=30)
histogram(~step_edges, data = clicktracking, scales=(list(x=list(log=TRUE, limits=c(-1,20000), labels=c("0","1","10","100","1000","10000")))), xlab="Anzahl der ausgehenden Kanten", ylab="Prozent der Knotenmenge", col="grey", ylim=c(0,28), breaks=30)
histogram(~step_edges, data = decomposition, scales=(list(x=list(log=TRUE, limits=c(-1,20000), labels=c("0","1","10","100","1000","10000")))), xlab="Anzahl der ausgehenden Kanten", ylab="Prozent der Knotenmenge", col="grey", ylim=c(0,28), breaks=30)
histogram(~value.total_edges, data = edges_per_node, scales=(list(x=list(cex=100, log=TRUE, limits=c(-1,20000), labels=c("0","1","10","100","1000","10000")))), xlab="Anzahl der ausgehenden Kanten", ylab="Prozent der Knotenmenge", col="grey", ylim=c(0,28), breaks=30)

only_tagging <- edges_per_node[edges_per_node$value.tag_edges > 0.0,]
only_clicktracking <- edges_per_node[edges_per_node$value.click_edges > 0.0,]
only_decomposition <- edges_per_node[edges_per_node$value.decomposition_edges > 0.0,]
only_wortschatz <- edges_per_node[edges_per_node$value.wortschatz_edges > 0.0,]

histogram(~value.tag_edges, data = only_tagging, scales=(list(x=list(log=TRUE, limits=c(-1,20000), labels=c("0","1","10","100","1000","10000")))), xlab="Anzahl der ausgehenden Kanten", ylab="Prozent der Knotenmenge", col="grey", ylim=c(0,28), breaks=30)
histogram(~value.click_edges, data = only_clicktracking, scales=(list(x=list(log=TRUE, limits=c(-1,20000), labels=c("0","1","10","100","1000","10000")))), xlab="Anzahl der ausgehenden Kanten", ylab="Prozent der Knotenmenge", col="grey", ylim=c(0,28), breaks=20)
histogram(~value.decomposition_edges, data = only_decomposition, scales=(list(x=list(log=TRUE, limits=c(-1,20000), labels=c("0","1","10","100","1000","10000")))), xlab="Anzahl der ausgehenden Kanten", ylab="Prozent der Knotenmenge", col="grey", ylim=c(0,50), breaks=20)
histogram(~value.wortschatz_edges, data = only_wortschatz, scales=(list(x=list(log=TRUE, limits=c(-1,20000), labels=c("0","1","10","100","1000","10000")))), xlab="Anzahl der ausgehenden Kanten", ylab="Prozent der Knotenmenge", col="grey", ylim=c(0,50), breaks=20)
