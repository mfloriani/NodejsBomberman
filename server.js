var express = require('express');
var engine = require('ejs-mate');

var app = express();
app.engine('ejs', engine);
app.use(express.static('./public'));
app.set('view engine', 'ejs');
app.set('views', './views');

var http = require('http');
var port = 3000;

var MongoClient = require("mongodb").MongoClient;
var db = null;

MongoClient.connect('mongodb://127.0.0.1/bomberman', function (error, instance) {
    if (error)
        console.log("Error connecting to mongoDB: " + error);
    else {
        db = instance;
        http.createServer(app).listen(port, function () {
            console.log('server online');
        });
    }
});

app.post('/addNewScore/:score', function (req, res) {
    var _score = parseInt(req.params.score);
    db.collection("scores").insert({ pontos: _score });
    res.status(200);
});

app.post('/getTopTen', function (req, res) {
    
    db.collection("scores").find({}, {_id: 0}).sort({ pontos: -1 }).limit(10).toArray(function (error, results) {
        if (error) {
            //console.log(error);
            return;
        }
        console.log(results);;
        res.status(200).send(results);
    });

});
