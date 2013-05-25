require "bundler/setup"
require "mongo"
require "mysql2"
require "yaml"

include Mongo

class Importer

  LIMIT = 1000

  def initialize
    self.setup
  end

  def reset(options={})

    default_options = {
        :shard => false,
    }
    options = default_options.merge(options)

    @mongo.drop_database(@config['mongodb']['database'])

    if options[:shard]
      # sharding setup
      enableShardingCommand = BSON::OrderedHash.new
      enableShardingCommand['enableSharding'] = @config['mongodb']['database']
      @admin.command(enableShardingCommand)
    end
  end

  def import(table, options={})

    default_options = {
        :shard => false,
    }
    options = default_options.merge(options)

    @db[table].drop

    if(options[:shard])
      shardCollectionCommand = BSON::OrderedHash.new
      shardCollectionCommand['shardCollection'] = "spreadshirt.#{table}"
      shardCollectionCommand['key'] = { '_id' => 1 }
      @admin.command(shardCollectionCommand)
    end

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

      @config = YAML.load_file('../configuration/db.yml')

      @mysql = Mysql2::Client.new(:host => @config['mysql']['host'], 
                                  :port => @config['mysql']['port'], 
                                  :username => @config['mysql']['username'], 
                                  :password => @config['mysql']['password'], 
                                  :database => @config['mysql']['database'])


      @mongo = MongoClient.new(@config['mongodb']['host'])

      # databases
      @admin = @mongo['admin']
      @db = @mongo[@config['mongodb']['database']]
    end
end
