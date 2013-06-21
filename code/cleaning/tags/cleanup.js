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