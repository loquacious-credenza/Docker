var UserMethods = require('../Controllers/user-controller.js');
var TripMethods = require('../Controllers/trip-controller.js');
var path = require('path');


module.exports = function (app, express) {
/* =============== LOGIN ================= */
// LOGS THE USER IN USING FACEBOOK API, REDIRECTS TO EITHER 'create-route' OR 'current-route' SCREEN DEPENDING IF THE USER'S ACCOUNT ALREADY HAS
// AN ONGOING ROUTE ASSOCIATED WITH IT.
// POST - /LOGIN


/* =========== TRIP ENDPOINTS =========== */
// CREATES A TRIP
	app.post('/user/:user_id/trip', function (req, res) {
		console.log('Hitting endpoint: ', req.url);
    	TripMethods.create(req, res);
	});

// GETS A TRIP
	app.get('/user/:user_id/trip', function (req, res) {
		console.log('Hitting endpoint: ', req.url);
		TripMethods.read(req, res);
	});

// UPDATES A TRIP'S GEOLOCATION DATA
	app.put('/user/:user_id/trip', function (req, res) {
		console.log('Hitting endpoint: ', req.url);
		TripMethods.addLocPoints(req.params.user_id, req.body, res);
	});

// MARKS A TRIP AS 'active: false'
	app.delete('/user/:user_id/trip', function (req, res) {
		console.log('Hitting endpoint: ', req.url);
		TripMethods.renderInactive(req.params.user_id, res);
	});

/* ================ USER ENDPOINTS ================ */
// GET USER STATS
	app.get('/user/:user_id', function (req, res) {
		console.log('Hitting endpoint: ', req.url);
		UserMethods.findUser(req.params.user_id, res);
	});

// CREATE NEW USER OR RESPOND WITH USER & TRIP DATA
	app.post('/user/:user_id', function (req, res) {
		console.log('Hitting endpoint: ', req.url);
		UserMethods.findOrCreateUser(req.body, res);
	});

// UPDATES USER STATS
	app.put('/user/:user_id', function (req, res) {
		console.log('Hitting endpoint: ', req.url);
    	UserMethods.update(req.params.user_id, req.body.prop, req.body.data, res);
	});

// UPDATE USER CONTACTS
  app.put('/user/:user_id/contacts', function (req, res) {
  	console.log('Hitting endpoint: ', req.url);
  		UserMethods.updateContacts(req.params.user_id, req.body, res);
  });

  app.delete('/user/:user_id/contacts', function (req, res) {
  	console.log('Hitting endpoint: ', req.url);
  		UserMethods.removeContact(req.params.user_id, req.body.id, res);
  });

/* ================ CONTACT ENDPOINTS ================= */
	app.get('/userpath/:user_id/:trip_id', function (req, res) {
		console.log('Hitting endpoint: ', req.url);
		TripMethods.readContactPage(req, res);
	});

	app.get('/userpath/:user_id/:trip_id/user', function (req, res) {
		console.log('Hitting endpoint: ', req.url);
		UserMethods.findUser(req.params.user_id, res);
	});
}





