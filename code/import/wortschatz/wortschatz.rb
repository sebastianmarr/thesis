require "wlapi"
require "mongo"

class Wortschatz

    include Mongo

    def initialize

        @mongo = MongoClient.new

        @graph = @mongo.db 'graph'
        @target_db = @mongo.db 'wortschatz'
        @target_collection = @target_db.collection 'words'

        @target_collection.ensure_index('string', unique: true)

        @api = WLAPI::API.new
        @nodes = @graph.collection('nodes').find({singleWord: true}, fields: ['string'])
    end

    def get_wortschatz_service(service)
        @nodes.each do |node|
            word = node['string']
            query(word, service) unless already_queried?(word, service)
        end
    end

    private

        def already_queried?(word, service)
            @target_collection.find_one({'string' => word, service => {'$exists' => true}})
        end

        def query(word, service)
            begin
                result = request_service_for_word(word, service)
                store_result(word, service, result)
            rescue WLAPI::ExternalError
                puts "Error with word: " + word
            end 
        end

        def store_result(word, service, result)
            @target_collection.update(
                {'string' => word}, 
                {'$set' => {service => result}},
                upsert: true
            )
        end

        def request_service_for_word(word, service) 
            @api.send service, word
        end
end
