require "mongo"
require "unicode"

class String
    def number?
        return self.match(/^\d*$/)
    end

    def sanitize
        self.gsub(/^[^[:alnum:]]*/, '').gsub(/[^[:alnum:]]*$/, '')
    end

    def capitalize_with_dashes
        self.split('-').map { |e| Unicode::capitalize e }.join('-')
    end

    def valid?
        !(self.empty? || self.number?)
    end
end

include Mongo

def words(node)
    node['string'].split.inject([]) do |words, word|
        sanitized = word.sanitize
        words << sanitized if sanitized.valid?
        words
    end
end


mongo = MongoClient.new
db = mongo.db 'graph'
nodes = db.collection 'nodes'
edges = db.collection 'edges'

nodes.find({}, fields: ['string', 'language']).each do |tag_node|

    words = words(tag_node)     

    words.each do |word|

        # insert word node
        word_node = {string: word, language: tag_node['language']}
        existing = nodes.find_one(word_node)
        word_id = existing ? existing['_id'] : nodes.insert(word_node)

        # insert word edges
        edges.insert({source: tag_node['_id'], target: word_id, type: "decomposition"})
        edges.insert({source: word_id, target: tag_node['_id'], type: "composition"})
    end
end
