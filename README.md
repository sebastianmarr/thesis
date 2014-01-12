# Laphroaig

This is the repository of my Master's Thesis, including all the code, relevant resources and documentation. 

The codename [Laphroaig][1] is that of a distillery in Scotland.

The final thesis pdf is available [here](masterarbeit.pdf).

## Subject

The subject of my thesis is to find semantics in user-generated tags. Partners of Spreadshirt are able to tag their uploaded designs and created articles. Those tags are unstructured and can be chosen completely freely.

It is of great interest to mine knowledge from this unstructured data, the biggest goal being to extract topics from groupings of those tags. Topics can then be used to gather further knowledge about customer behaviour, for example which topics are bought by customers in a seasonal manner.

Another example would be to optimize Search Engine Marketing and Search Engine Optimization by understanding which keywords are most searched for under which circumstances.

## Methodology

The gathering of knowledge from those unstructured tags was achieved using the basic principle of co-occurence. Finding associations between tags was based on how often these tags are used together. Out of this information, a graph was formed. The nodes of this graph are the terms, the edges represent semantic connections between them.

To improve the quality of those connections, further data sources were integrated. These include clicktracking data, Google Translate for language detection and the Wortschatz project of the University of Leipzig for dictionary data on German words.

For each data source, the data had to be cleaned, transformed and integrated into the graph.

## Technology

To achieve those goals, the following technology stack was used:

* Database: [MongoDB][2]
* Integration Scripts: JavaScripts directly for MongoDB shell
* Tool for exploring data: node.js with Express framework and D3.js for visualization

## Tag Explorer

To view the results, have a look at the [Tag Explorer Tool][3] (only accessible within Spreadshirt).

[1]: http://en.wikipedia.org/wiki/Laphroaig_distillery
[2]: http://www.mongodb.org/
[3]: http://vm124.virtual:3000