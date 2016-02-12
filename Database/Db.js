var mongoose = require('mongoose');
var Mongo = require('../ApiKeys/mongolab.js');
var env = process.env.NODE_ENV;

console.log('Mongo: ', Mongo.MONGO_URL);
var db = mongoose.connect(Mongo.MONGO_URL);

module.exports = db;
