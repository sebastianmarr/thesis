require "wlapi"
require "mongo"

require_relative 'word_list'

class Wortschatz

    include Mongo

    def initialize
        @target_collection = MongoClient.new['wortschatz']['words']
        @target_collection.ensure_index('string', unique: true)
        @api = WLAPI::API.new
        @words = WordList.list
    end

    def get_wortschatz_service(service)
        @words.each { |word| query(word, service) unless already_queried?(word, service) }
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
