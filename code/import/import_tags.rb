require_relative 'importer'

i = Importer.new

['ss_tags', 'ss_tag_link_object'].each do |table|
    puts "importing #{table}..."
    i.import table
end