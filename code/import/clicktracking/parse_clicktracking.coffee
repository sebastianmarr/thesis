# takes json clicktracking import and outputs (to stdout) usable click data that can directly be imported into mongodb

fs = require "fs"

class Click
    constructor: (@query, @articleId, @platform, @language) ->

parseClickTracking = (path) ->
    fs.readFileSync(path).toString().split('\n').forEach (line) ->
        try
            parseLine line
        catch e
            # do nothing, end of file reached

parseLine = (line) ->
    input = JSON.parse line
    query = parseQuery input
    articleId = parseArticleId input
    platform = parsePlatform input
    language = parseLanguage input
    console.log JSON.stringify(new Click(query, articleId, platform, language))

parseQuery = (input) ->
    if input.params && x = input.params['search-query']
        x.slice 1, -1

parseArticleId = (input) ->
    if input.params && x = input.params.cl
        articles = x.slice(1, -1).split(',').filter((z) -> z.charAt(0) == 'a')
        articles[0].slice(1)

parsePlatform = (input) ->
    input.path.slice 7, 9

parseLanguage = (input) ->
    if input.params && x = input.params.locale
        x.slice 1, 3

process.argv.forEach (path, index) ->
    if index >= 2
        parseClickTracking path
