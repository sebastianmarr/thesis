# takes json clicktracking import and outputs (to stdout) usable click data that can directly be imported into mongodb

fs = require "fs"

parseClickTracking = (path) ->
    fs.readFileSync(path).toString().split('\n').forEach (line) ->
        try
            parseLine line
        catch e
            # do nothing, end of file reached

parseLine = (line) ->

    input = JSON.parse line

    date = new Date(input.date.split('_')[0])
    platform = input.path.slice(7, 9)

    # no sense continuing without click parameters
    if params = input.params

        query = if x = params['search-query'] 
                    params['search-query'].slice(1,-1)
                else null

        articleId = parseCl params, 'a'
        productId = parseCl params, 'p'
        index = parseCl params, 'i'

        language = params.locale.slice(1, 3)

        click =
            date: date
            platform: platform
            query: query
            articleId: articleId
            productId: productId
            index: index
            language: language

        process.stdout.write JSON.stringify(click) + '\n'


parseCl = (input, type) ->
    if x = input.cl
        objects = x.slice(1, -1).split(', ').filter((z) -> z.charAt(0) == type)
        objects[0].slice(1)
    else null

parsePlatform = (input) ->
    input.path.slice 7, 9


process.argv.forEach (path, index) ->
    if index >= 2
        parseClickTracking path
