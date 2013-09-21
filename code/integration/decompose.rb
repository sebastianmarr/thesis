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
        words.uniq
    end
end


mongo = MongoClient.new
db = mongo.db 'graph'
nodes = db.collection 'nodes'
edges = db.collection 'edges'

edges.remove({type: "composition"})
edges.remove({type: "decomposition"})

nodes.find({}, fields: ['string', 'language'], timeout: false) do |cursor|
    cursor.each do |tag_node|
        
        words = words(tag_node)
        
        words.each do |word|
            
            # insert word node
            word_node = {string: word, language: tag_node['language']}
            existing = nodes.find_one(word_node)
            word_id = existing ? existing['_id'] : nodes.insert(word_node.merge({origin: "decomposition"}))
            
            node1 = tag_node['_id']
            node2 = word_id

            unless node1 == node2

                edge1 = {source: node1, type: "decomposition", target: node2}
                edge2 = {source: node2, type: "composition", target: node1}

                [edge1, edge2].each { | edge| edges.insert(edge) }
            end
        end
    end
end
