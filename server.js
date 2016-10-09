const express = require('express');
const app = express();
const bodyParser= require('body-parser');
const MongoClient = require('mongodb').MongoClient;

var db;

MongoClient.connect('mongodb://artest:000000@ds053176.mlab.com:53176/crud_practice', (err, database) => {
    if(err) return console.log(err);
    db = database;
    app.listen(3000, () => {
        console.log('listening on 3000');
    });
});

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true})); // 讓post回來的資料會存在req的body裡
app.use(express.static('public'));
app.use(bodyParser.json());

// All your handlers here...
app.get('/', (req, res) => {
    db.collection('quotes').find().toArray((err, result) => {
        if(err) return console.log(err);
        // renders index.ejs
        res.render('index.ejs', {
            quotes: result
        });
    });
    //res.sendFile(__dirname + '/index.html');
    // Note: __dirname is the path to your current working directory.
    // Try logging it and see what you get!

});

app.post('/quotes', (req, res) => {
    //console.log(req.body)
    db.collection('quotes').save(req.body, (err, result) => {
        if(err) return console.log(err);
        console.log('saved to database');
        res.redirect('/');
    });
});

app.put('/quotes', (req, res) => {
    // Handle put request
    db.collection('quotes').findOneAndUpdate(
        {name: 'AR'},
        {
            $set: {
                name: req.body.name,
                quote: req.body.quote
            }
        },
        {
            sort: {_id: -1},
            upsert: true
        },
        (err, result) => {
            if(err) return res.send(err);
            res.send(result);
        }
    );
});

app.delete('/quotes', (req, res) => {
    // Handle delete event here
    db.collection('quotes').findOneAndDelete(
        {name: req.body.name},
        (err, result) => {
            if (err) return res.send(500, err)
            res.send('A darth vadar quote got deleted');
        }
    );
})
