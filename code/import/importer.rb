require "bundler/setup"
require "mongo"
require "mysql2"

include Mongo

class Importer

  LIMIT = 1000

  def initialize
    self.setup
  end

  def reset

    @mongo.drop_database("spreadshirt")

    # sharding setup
    enableShardingCommand = BSON::OrderedHash.new
    enableShardingCommand['enableSharding'] = 'spreadshirt'
    @admin.command(enableShardingCommand)
  end

  def import(table)

    @db[table].drop

    # enable sharding for that collection
    shardCollectionCommand = BSON::OrderedHash.new
    shardCollectionCommand['shardCollection'] = "spreadshirt.#{table}"
    shardCollectionCommand['key'] = { '_id' => 1 }
    @admin.command(shardCollectionCommand)

    batch = []
    rows = @mysql.query("SELECT *
                         FROM #{table}",
                         :cache_rows => false,
                         :cast => true)

    rows.each do |row|

      # find all BigDecimal and convert to floats, since mongo won't take BigDecimal
      row.each do |key, value|
        if value.class == BigDecimal
          row[key] = value.to_f
        end
      end

      batch << row
      if batch.count == LIMIT
        @db[table].insert(batch)
        batch = []
      end
    end
    @db[table].insert(batch)
  end

  @private

    def setup
      @mysql = Mysql2::Client.new(:host => "db.cloudclaus.virtual", 
                                  :port => 3308, 
                                  :username => "catalog", 
                                  :password => "ooru1kaedae8Eehu", 
                                  :database => "marr_fulldump")


      @mongo = MongoClient.new('vm124.virtual')

      # databases
      @admin = @mongo['admin']
      @db = @mongo['spreadshirt']
    end
end
