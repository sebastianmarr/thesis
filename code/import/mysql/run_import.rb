require_relative 'importer'

if !ARGV[0]
    raise "Please specify a database configuration from db.yml" 
end

db_configuration = ARGV[0]

i = Importer.new(db_configuration, reset_mongo:true, shard: true)

{'ss_tags' => ['tag_id', 'tag', 'lang'], 
 'ss_tag_link_object' => ['tag_id', 'object_id', 'object_type_id'],
 'ss_productng_configurations' => ['product_id', 'type', 'design_id'],
 'ss_order_orderitems' => ['orderitem_id', 'order_id', 'product_id', 'article_id', 'quantity']
}.each do |table, columns|
    puts "importing #{table}..."
    i.import(table, columns, shard: true)
end
