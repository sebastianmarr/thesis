require_relative 'importer'

i = Importer.new(reset_mongo:true, shard: true)
['ss_tags', 
 'ss_tag_link_object',
 'ss_productng_configurations',
 'ss_order_orderitems'
].each do |table|
    puts "importing #{table}..."
    i.import(table, shard: true)
end
