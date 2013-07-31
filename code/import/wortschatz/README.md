# Wortschatz Uni Leipzig

The [Wortschatz](http://wortschatz.uni-leipzig.de) of the Leipzig University holds a lot of interesting data about german words, such as synonyms, baseforms, categories and more. It is therefore highly useful to be able to use that data in the graph.

## Usage

Just initialize the Wortschatz class with

    require './wortschatz'
    w = Wortschatz.new

and query a service like this:

    w.get_wortschatz_service 'baseform'

Available services are

- `baseform`
- `cooccurrences`
- `cooccurrences_all`
- `domain`
- `frequencies`
- `left_neighbours`
- `right_neighbours`
- `sentences`
- `synonyms`
- `thesaurus`
- `wordforms`

The result of the queries will be stored in a MongoDB database `wortschatz`, collection `words` on `localhost`.
