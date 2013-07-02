print("Sanitizing...")
load('cleaning/tags/sanitize.js');
print("Done.\n")

print("Joining Tags with Objects...")
load('cleaning/tags/join.js');
print("Done.\n")

print("Removing Duplicates...");
load('cleaning/tags/dedup.js');
print("Done.\n");
