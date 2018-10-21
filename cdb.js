var db = new PouchDB(dbName);
var remoteCouch = couchDBSource + dbName;
updatedDB();
var sync = PouchDB.sync(dbName, remoteCouch, {
    live: true,
    retry: true
}).on('change', function (info) {
    console.log("Change");
    updatedDB();
}).on('paused', function (err) {
    console.log("Paused");
}).on('active', function () {
    console.log("ACtive");
    updatedDB();
}).on('denied', function (err) {
    console.log("Denied");
}).on('complete', function (info) {
    console.log("Complete");
}).on('error', function (err) {
    console.log("Error");
});
db.changes({
    since: 'now',
    live: true
}).on('change', updatedDB);
function sync() {
    var opts = { live: true };
    db.replicate.to(remoteCouch, opts, syncError);
    db.replicate.from(remoteCouch, opts, syncError);
}
function syncError(error) {
    console.log("There was an error in syncing - " + error);
}

function updatedDB() {
    db.allDocs({ include_docs: true }, function (err, doc) {
        app.entries = doc.rows;
    });
}
