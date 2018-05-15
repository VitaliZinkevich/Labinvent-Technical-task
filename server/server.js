'use strict';

var express = require ('express')
var app = express()
var bodyParser = require('body-parser')
var wifiList = require ('./mock.json')


var MongoClient = require('mongodb').MongoClient
  , assert = require('assert');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.listen (3000, ()=>{
  console.log ('listen on 3000')
})




app.get ('/wifilist', function (req, res){

  function favorite(a,b) {
    if (b.favorite > a.favorite) {
      return 1
    } else {
      return -1
    }
    return 0;
  }

  function strength(a,b) {
        return b.strength - a.strength;
  }

  wifiList = wifiList.sort(strength).sort (favorite)

  res.send (wifiList)

})


app.post ('/saveconfig', function (req, res) {

if (req.body.config) {
  let config = req.body.config
  // Use connect method to connect to the server
  MongoClient.connect('mongodb://localhost:27017/networkSet', { useNewUrlParser: true }, function(err, result) {
    assert.equal(null, err);
    const db = result.db('networkSet');
    db.collection('configs').insert (config)
    res.status(200).end()
  });
}

})

app.get ('/restoreform', function (req, res){


MongoClient.connect('mongodb://localhost:27017/networkSet', { useNewUrlParser: true }, function(err, result) {
  assert.equal(null, err);
  const db = result.db('networkSet');
  db.collection('configs').find({}, {projection:{ _id: 0 }} ).sort({_id:-1}).limit(1).toArray(function (err, result){

    res.send (result)
  })

  //res.send (lastConf)

});

})
