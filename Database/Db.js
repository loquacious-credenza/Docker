var mongoose = require('mongoose');
var Mongo = require('../ApiKeys/mongolab.js');

console.log('Mongo: ', Mongo.MONGO_URL);
mongoose.connect(Mongo.MONGO_URL);

var db = mongoose.connection;

module.exports = db;
