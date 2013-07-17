# takes json clicktracking import and outputs (to stdout) usable click data that can directly be imported into mongodb

fs = require "fs"
moment = require "moment"


parseClickTracking = (path) ->
    fs.readFileSync(path).toString().split('\n').forEach (line) ->
        try
            parseLine line
        catch e
            # do nothing, end of file reached

parseLine = (line) ->

    input = JSON.parse line


    params = input.params
    query = input.params['search-query'].slice 1, -1

    # no sense continuing without click parameters or query
    if params && query
                
        articleId = parseCl params, 'a'
        productId = parseCl params, 'p'
        index = parseCl params, 'i'

        language = params.locale.slice(1, 3)

        date = moment(input.date.split('_')[0], "DD.MM.YYYY HH:mm:ss_SSS").toDate()
        platform = input.path.slice(7, 9)


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
        parseInt(objects[0].slice(1))
    else null

parsePlatform = (input) ->
    input.path.slice 7, 9


process.argv.forEach (path, index) ->
    if index >= 2
        parseClickTracking path
