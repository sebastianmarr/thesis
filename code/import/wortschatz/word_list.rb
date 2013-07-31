require "wlapi"
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

class WordList

    include Mongo

    def self.list
        all_nodes.inject([]) { |list, node| list.concat words(node) }
    end

    private

        def self.all_nodes
            MongoClient.new['graph']['nodes'].find({}, fields: ['string'], limit: 10)
        end

        def self.words(node)
            node['string'].split.inject([]) { |words, word| words.concat process_word(word) }.uniq
        end

        def self.process_word(word)
            sanitized = word.sanitize
            processed = sanitized.valid? ? [sanitized, sanitized.capitalize_with_dashes] : []
        end
end
