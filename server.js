const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient
let db;

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));
app.use(bodyParser.json());



MongoClient.connect('mongodb://kevin:starwars@ds161459.mlab.com:61459/star-wars-quotes', (err, client) => {
  if(err){
    return console.log(err);
  }else{
    db = client.db('star-wars-quotes');
    app.listen(3000, () => {
      console.log('listening on port 3000');
    });
  }
});


app.get('/', (req, res) => {
  let cursor = db.collection('quotes').find().toArray((err, result) => {
    console.log(result)
    res.render('index.ejs', {quotes: result})    
  });
});

app.post('/quotes', (req, res) => {
  db.collection('quotes').save(req.body, (err,result) => {
    if(err){
      return console.log(err);
    }else{
      console.log('saved to database');
      res.redirect('/');
    }
  });
});

app.put('/quotes', (req, res) => {
  db.collection('quotes')
  .findOneAndUpdate({name: 'Yoda'}, {
    $set: {
      name: req.body.name,
      quote: req.body.quote
    }
  }, {
    sort: {_id: -1},
    upsert: true
  }, (err, result) => {
    if (err) return res.send(err)
    res.send(result)
  })
})

app.delete('/quotes', (req, res) => {
  db.collection('quotes').findOneAndDelete({name: req.body.name},
  (err, result) => {
    if (err) return res.send(500, err)
    res.send({message: 'A darth vadar quote got deleted'})
  })
})

