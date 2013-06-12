require_relative 'importer'

if !ARGV[0]
    raise "Please specify a database configuration from db.yml" 
end

db_configuration = ARGV[0]

i = Importer.new(db_configuration, reset_mongo:true, shard: true)

['ss_tags', 
 'ss_tag_link_object',
 'ss_productng_configurations',
 'ss_order_orderitems'
].each do |table|
    puts "importing #{table}..."
    i.import(table, shard: true)
end
