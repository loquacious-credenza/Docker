var mongoose = require('../Database/Db.js');
var ContactSchema = require('./contact.js').schema;
var TripSchema = require('./trip.js').schema;

var UserSchema = new mongoose.Schema({
	_id: String,
	name: String,
  password: String,
	phone: Number,
	delay: {type: Number, default:30},
	contacts: [ContactSchema],
	trips: [ String ]
});

module.exports = mongoose.model("User", UserSchema);
