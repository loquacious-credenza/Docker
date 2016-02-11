'use strict';

var _ = require('lodash');

var User = require('../Models/user.js');
var Trip = require('../Models/trip.js');

module.exports = {
	//FINDS 'user' BY ID AND RETURNS JSON.
	findUser: function (id, res) {
		User.findById(id, function (err, response) {
			if (err) {
				console.log("Error finding user: ", err);
				res.sendStatus(500);
			} else {
				res.json(response);
			}
		});
	},
	// SEARCHES FOR 'user' BY ID INCLUDED IN 'userObj'. IF 'user' IS FOUND, THE ID ASSOCIATED WITH 'user' IS USED TO SEARCH
	// FOR AN ACTIVE 'trip'. BOTH 'user', AND 'trip' ARE THEN ATTACHED TO THE 'combinedData' OBJECT, WHICH IS SENT TO THE CLIENT.
	// IF THE USER IS NOT INITIALLY FOUND, 'user' IS CREATED IN THE DATABASE USING 'userObj' AND THEN RETURNED. IN THIS CASE, 'activeTrip'
	// DEFAULTS TO 'null'.
	findOrCreateUser: function (userObj, res) {
		var combinedData = {};
		User.findById(userObj._id, function (err, response) {
			if (err) {
				console.log("Error finding user: ", err);
				res.sendStatus(500);
			} else if (response !== null) {
				combinedData.user = response;
				Trip.find({active: true, user_id: response._id}, function (err, response) {
					if (err) {
						console.log("Error finding trip associated with user: ", err);
						res.sendStatus(500);
					} else {
            combinedData.activeTrip = _.last(response) || null;
            res.json(combinedData);
          }
        });
      } else {
        User.create(userObj, function (err, response) {
          if (err) {
            console.log("Error creating user: ", err);
            res.sendStatus(500);
          } else {
            combinedData.user = response;
            combinedData.activeTrip = null;
						res.json(combinedData);
					}
				});
			}
		});
	},
	// SEARCHES FOR USER BY 'id' AND UPDATES CONTACTS USING 'contactsArr'. 'contactsArr' MUST
	// BE AN ARRAY OF VALUES MATCHING THE SCHEMA OUTLINED IN 'contact.js'.
	updateContacts: function (id, contactsArr, res) {
		User.findByIdAndUpdate(id, {$set: {contacts: contactsArr}}, {new: true}, function (err, response) {
			if (err) {
				console.log("Error updating user contacts: ", err);
				res.sendStatus(500);
			} else {
				res.json(response);
			}
		});
	},
	// SEARCHES FOR USER BY 'id' AND REMOVES THE CONTACT SPECIFIED BY 'contactId'. RETURNS THE MODIFIED USER OBJECT.
	removeContact: function (id, contactId, res) {
		User.findByIdAndUpdate(id, {$pull: {contacts: {_id: contactId}}}, {new: true}, function (err, response) {
			if (err) {
				console.log("Error deleting user contact: ", err);
				res.sendStatus(500);
			} else {
				res.json(response);
			}
		});
	},
	// SIMILAR TO 'updateContacts'. 'update' TAKES A USER'S ID AND UPDATES THE 'prop' FIELD WITH 'data'. THESE
	// ARGUMENTS ARE PROVIDED IN 'routes.js'. 'updateContacts' COULD PROBABLY BE REPLACED ALTOGETHER.
	update: function (id, prop, data, res) {
    var obj = {};
    obj[prop] = data
    User.findByIdAndUpdate(id, obj, {new: true}, function (err, response) {
      if (err) {
        console.log("Error updating user: ", err);
        res.sendStatus(500);
      } else {
        res.json(response.delay);
      }
    });
  }

}




