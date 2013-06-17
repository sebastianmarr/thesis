require "bundler/setup"
require "mongo"
require "mysql2"
require "yaml"
require "net/ssh/gateway"

include Mongo

class Importer

  def initialize(config_name,reset_mongo: false, shard: false)
    config = read_config[config_name]

    if !config
      raise "Database configuration not found"
    end

    @mongo = connect_mongo(config['mongodb'])
    @mysql = connect_mysql(config['mysql'])

    reset(@mongo.connection, config['mongodb']['database'], shard: shard) if reset_mongo
  end

  def import(dataset, columns = nil, drop: true, shard: false, batch_size: 1000)
    @mongo[dataset].drop if drop
    shard_collection(@mongo, dataset) if shard

    select = if columns
      columns.join  ","
    else
      "*"
    end

    batch = []
    @mysql.query("SELECT #{select} FROM #{dataset}", cache_rows: false, cast: true).each do |row|

      # find all BigDecimal and convert to floats, since mongo won't take BigDecimal
      row.each { |key, value| row[key] = value.to_f if value.class == BigDecimal }

      batch << row
      if batch.count == batch_size
        @mongo[dataset].insert(batch)
        batch = []
      end
    end
    @mongo[dataset].insert(batch)
  end

  @private

    def read_config
      YAML.load_file('./db.yml')
    end

    def connect_mongo(config)
      conn = MongoClient.new config['host']
      conn[config['database']]
    end

    def connect_mysql(config)
      tunnel = config['ssh']
      port = config['port']
      host = config['host']

      if tunnel
        port = tunnel_port(tunnel, port)
        host = '127.0.0.1'
      end

      Mysql2::Client.new(:host => host, 
                         :port => port, 
                         :username => config['username'], 
                         :password => config['password'], 
                         :database => config['database'])
    end

    def tunnel_port(ssh_config, port)
      gateway = Net::SSH::Gateway.new(
                 ssh_config['host'],
                 ssh_config['username'],
                 :keys => [ssh_config['key']])
      port = gateway.open("127.0.0.1", port, 13307)
    end

    def reset(mongo_connection, database, shard: false)
      mongo_connection.drop_database database
      shard_database(mongo_connection, database) if shard
    end

    def shard_database(mongo_connection, database)
      enableShardingCommand = BSON::OrderedHash.new
      enableShardingCommand['enableSharding'] = database
      mongo_connection['admin'].command(enableShardingCommand)
    end

    def shard_collection(database_connection, collection, shard_key: {'_id' => 1})
      shardCollectionCommand = BSON::OrderedHash.new
      shardCollectionCommand['shardCollection'] = "#{database_connection.name}.#{collection}"
      shardCollectionCommand['key'] = shard_key
      database_connection.connection['admin'].command(shardCollectionCommand)
    end
end
