# Laphroaig

This is the repository of my Master's Thesis, including all the code, relevant resources and documentation. 

The name [Laphroaig][1] is that of a distillery in Scotland.

## Subject

The subject of my thesis is to find semantics in user-generated tags. Partners of Spreadshirt are able to tag their uploaded designs and created articles. Those tags are unstructured and can be chosen completely freely.

It is of great interest to mine knowledge from this unstructured data, the biggest goal being to extract topics from groupings of those tags. Topics can then be used to gather further knowledge about customer behaviour, for example which topics are bought by customers in a seasonal manner.

Another example would be to optimize Search Engine Marketing and Search Engine Optimization by understanding which keywords are most searched for under which circumstances.

## Methodology

The gathering of knowledge from those unstructured tags can be divided into four parts: extraction, cleaning, integration and mining.

### Data Extraction

The first step is to extract the tag data from the Opossum MySQL database for further investigation and processing. This is done via some simple Ruby scripts that pull the relevant tables directly from MySQL into the database that is used for analysis (currently MongoDB).

### Data Cleaning

To narrow the search space and be able to use the data efficiently, it first has to be cleaned. For the problem of cleaning the tag data, some cleaning steps can be thought of instantly:

* eliminate case sensitivity in tags to combine duplicate tags
* combine tags by finding misspellings of a tag
* remove tags that are used for SEO by the partner and do not describe the product

Clearly, there will be more ways to clean the data that will arise during further investigation of the data set.

### Data Integration

The tag data has then to be integrated into a data structure suitable for mining. The current idea fur that data structure is a graph. This graph includes all the remaining tags (after cleaning) as nodes. The edges of the graph describe, how often to tags are used together. This results in a measure of distance between the tags.

Further integration, for example of external dictionary data, can lead to more than one type of edges. One could think of edges, that desribe is-a, homonym, synonym and other relationships between tags, that can later be used for mining.

### Data Mining

The biggest goal of mining these tags is to extract clusters of tags that form topics. This means, that the mining step will currently mostly consist of running clustering algorithms on the integrated data. Once clusters are found using appropriate disctance tresholds, it is important to find the center of a cluster. The hypothesis at this point is that a center of a cluster describes the topic of that cluster. This hypothesis has to verified with real data.

Which and how clustering algorithms will be applied to the data will be the main part of the mining step.

Once the clusters are formed, they can be uses for further analyses, for example by overlaying them with sales data to find seasonal trends of certain topics.

## Technology

To achieve those goals, the following technology stack will be uses (subject to change):

* Database: [MongoDB][2]
* Experimental application of algorithms: [R][3]
* Large scale application of algorithms: direct execution of JavaScript in MongoDB or [Mahout][4]

[1]: http://en.wikipedia.org/wiki/Laphroaig_distillery
[2]: http://www.mongodb.org/
[3]: http://www.r-project.org/
[4]: http://mahout.apache.org/