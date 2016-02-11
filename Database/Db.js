var mongoose = require('mongoose');
var Mongo = require('../ApiKeys/mongolab.js');
var env = process.env.NODE_ENV;


mongoose.connect(Mongo.MONGO_URL);

module.exports = mongoose;
