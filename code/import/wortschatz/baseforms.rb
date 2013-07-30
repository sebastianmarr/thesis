require "wlapi"
require "mongo"
require "unicode"
require "pry"

include Mongo

conn = MongoClient.new

graph_db = conn['graph']
nodes = graph_db['nodes']

wlapi_db = conn['wortschatz']
words = wlapi_db['words']
words.ensure_index('string')

api = WLAPI::API.new

wordlist = []

nodes.find(
    {}, fields: ['string'])
.each do |node|

    # extract words from node string and sanitize
    node['string'].split.each do |word|

        no_cap = word.gsub(/^[^[:alnum:]]*/, '').gsub(/[^[:alnum:]]*$/, '')

        unless no_cap.empty? || no_cap.match(/^\d*$/)
            cap = no_cap.split('-').map { |e| Unicode::capitalize e }.join('-')
            wordlist << no_cap
            wordlist << cap
        end
    end
end

wordlist = wordlist.uniq
wordlist.each do |word|
    unless words.find_one({'string' => word, 'baseforms' => {'$exists' => true}})
        begin
            response = api.baseform word
            words.insert({'string' => word, 'baseforms' => response})
        rescue WLAPI::ExternalError
            puts "Error with word: " + word
        end
    end
end
