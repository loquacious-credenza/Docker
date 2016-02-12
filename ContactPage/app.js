var mapCentered = false;

// RENDER MAP ONTO THE PAGE
var initializeMap = function () {
	return new google.maps.Map(document.getElementById('map'), {
		center: {lat:51.508742, lng:-0.120850},
		zoom:14,
		minZoom:1,
		maxZoom:100
	});
};

// THIS FUNCTION 
var openIframe = function() {
	console.log('CALLED!');
	if ( $('#videoLink').css("display") === 'none' ) {
		$('#videoLink').css("display","block");
		$('#linkButton').html("Click to close live video feed.");	
	} else {
		$('#videoLink').css("display","none");
		$('#linkButton').html("Click to open live video feed.");	
	}
};

// THIS FUNCTION TAKES THE TRIP OBJECT PROVIDED BY THE SERVER AND PULLS OUT THE 'path' & 'destination' KEY/VALUES AND RENDERS THEM
// ONTO THE MAP. CURRENTLY IT WILL RE-RENDER ALL OF THE POINTS PROVIDED WITHOUT DISCERNING IF THEY ARE ALREADY PRESENT ON THE MAP
// OR NOT. OBVIOUSLY, THIS ISN'T IDEAL. CONSIDER REFACTORING LATER.
var renderLocationsToMap = function (map, data) {
	var points = [];
	var path;
	var destination;
	for (var i = 0; i < data.path.length; i++) {
		points.push(new google.maps.LatLng(data.path[i].location.coordinates[1], data.path[i].location.coordinates[0]));
	};

	destination = new google.maps.Marker({
		position: new google.maps.LatLng(data.destination.location.coordinates[1], data.destination.location.coordinates[0])
	});

	path = new google.maps.Polyline({
		path: points,
		strokeColor: "#0000FF",
		strokeOpacity: 0.8,
		strokeWeight: 2
	});

	path.setMap(map);
	destination.setMap(map);
	if (!mapCentered) {
		mapCentered = true;
		map.setCenter(points[0]);
	}
};

// SETS THE TEXT OF THESE ELEMENTS TO THE DATA RECIEVED FROM THE SERVER.
var renderUserToPage = function (data) {
	$('.user-name').html(data.name);
};

// THIS FUNCTION MAKES A GET REQUEST TO THE SERVER EVERY 20 SECONDS, PROVIDING 'user_id' and 'trip_id' IN THE URL.
// IT THEN PASSES THE RESULTING DATA ALONG TO 'renderLocations'.
var updateLocationData = function (map, targetUrl) {
	console.log('targetUrl:', targetUrl);
	$.ajax({
		url: targetUrl,
		type: 'GET',
		success: function (data) {
			renderLocationsToMap(map, data);
		},
		error: function (err) {
			console.log("Error getting map data: ", err);
		}
	});
};

var updateUserData = function (targetUrl) {
	$.ajax({
		url: targetUrl + 'user',
		type: 'GET',
		success: function (data) {
			renderUserToPage(data);
		},
		error: function (err) {
			console.log("Error getting user data: ", err);
		}
	});
};

// THIS FUNCTION IS SOMEWHAT JANKY AND COULD PROBABLY BE AVOIDED ALTOGETHER WITH SOME REFACTORING. A WORD ON WHAT THIS FUNCTION IS FOR:
// CURRENTLY, THE CONTACT BEING NOTIFIED IS SENT A LINK TO localhost:8000/contacts/(user_id)/(trip_id). EXPRESS IS CURRENTLY SET TO SERVE
// STATIC FILES TO THIS URL. IN OTHER WORDS, CALLING GET TO THIS SAME URL RESULTS IN THE ENTIRE PAGE RELOADING. TO AVOID THIS, THIS FUNCTION
// PARSES OUT THE RELEVANT PARAMETERS IN THE ORIGINAL LINKS' URL AND ATTACHES THEM TO 'parsedUrl'. THIS NEW URL IS THEN USED FOR REQUESTING
// TRIP DATA FROM THE SERVER. IT ALSO PROVIDES A LINK FOR LIVE VIDEO FEED.
var parseUrl = function (url) {
	var parsedUrl = url.split('contact/');
  	var videoUrl = $('#videoLink').attr('src') + parsedUrl[1].split('/')[0];
  	console.log('video url is: ', videoUrl);
	parsedUrl = parsedUrl[0] + 'userpath/' + parsedUrl[1];
  	$('#videoLink').attr('src', videoUrl);
  	$('#linkButton').attr('href', videoUrl);
	return parsedUrl;
};

// WHEN THE PAGE FINISHES LOADING, 'updateLocationData' WILL BE SCHEDULED TO RUN EVERY 20 SECONDS WITH 'setTimeout'
$(document).ready(function () {

	$('#linkButton').on('click', function() {
		openIframe();
	});

	var map = initializeMap();
	var url = parseUrl($(location).attr('href'));
	updateUserData(url);
	updateLocationData(map, url);
	setTimeout(function () {
		updateLocationData(map, url);
	}, 20000);

});



