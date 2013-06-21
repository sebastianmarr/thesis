print("Copying collections...");


db.tmp_tags.drop();
db.tmp_order_orderitems.drop();
db.tmp_tag_link_object.drop();
db.tmp_productng_configurations.drop();

sh.shardCollection("workspace.tmp_tags", {_id: 1});
sh.shardCollection("workspace.tmp_productng_configurations", {_id: 1});
sh.shardCollection("workspace.tmp_tag_link_object", {_id: 1});
sh.shardCollection("workspace.tmp_order_orderitems", {_id: 1});

db.ss_tags.find().forEach(function(x) { db.tmp_tags.insert(x) });
db.ss_tag_link_object.find().forEach(function(x) { db.tmp_tag_link_object.insert(x) });
db.ss_order_orderitems.find().forEach(function(x) { db.tmp_order_orderitems.insert(x) });
db.ss_productng_configurations.find().forEach(function(x) { db.tmp_productng_configurations.insert(x) });


print("Sanitizing...")
load('cleaning/tags/sanitize.js');
print("Done.\n")

print("Removing Duplicates...");
load('cleaning/tags/dedup.js');
print("Done.\n");

print("Ranking by Orders...");
load('cleaning/tags/rankByOrders.js');
print("Done.\n");

print("Extracting Subset...");
load('cleaning/tags/subset.js');
print("Done.\n");