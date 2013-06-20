db.clicks.remove({query: {$in: [null, ""]}});

db.clicks.find().forEach(function(click) {
    var repl = new RegExp('/\"/', 'g')
    click.query = click.query.replace(repl, "");
    db.clicks.save(click);
});
