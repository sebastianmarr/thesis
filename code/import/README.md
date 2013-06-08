# Importer

This collection of Ruby scripts handles the import from MySQL to MongoDB. It is best to be invoked on the machine where the mongos instance runs.

Database configurations for import can be found (and added) in `db.yml`. A sample invocation of the import script would be
```
ruby run_import.rb marr_fulldump
```. This imports the default set of tables needed for tag analysis (using the `marr_fulldump` configuration in `db.yml`).