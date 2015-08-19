// =============================================================================
// DECLARE GLOBAL APP OBJECT & variables
// =============================================================================

var app = {};
// james' LCBO api key
app.jamesAPI = 'MDo5NGU5OWUzMi00MGY3LTExZTUtOWQ5Zi1mN2NjZDJlOTc2NmE6QUZXMkdYSUpnNGhCRnNDMzBYTXR4NkhOZzU2eTUza0FpRUFI';

// =============================================================================
// LOCATION LISTENER FUNCTION
// =============================================================================
app.locationListener = function(){
	// when the location form is submitted it starts the chain of functions!
	$( "#location" ).submit(function( event ) {
		//stop default action
		event.preventDefault();
		//get value from input field
		app.postal = $('.user-input').val();
		//just for test purposes so you don't have to keep putting in a place uncomment hamilton 
		//app.postal = 'hamilton';
		app.stores(app.postal);
	});

};
// =============================================================================
// STORES FUNCTION : returns stores closest to the user input
// =============================================================================
//take the users input location and return the closest store
app.stores = function(location){
	$.ajax({
		url: 'http://lcboapi.com/stores',
		type: 'GET',
		dataType: 'jsonp',
		data: {
			access_key: app.jamesAPI,
			per_page: 5,
			//users location is passed into the api request
			geo: location
		}
		//data is the result of the api call....in this case it is an array with 5 objects representing locations
	}).then(function(data) {
		console.log('These are the 5 stores closest to the USER');
		//just grab the first location to start
		app.store1 = data.result[0];
		app.store2 = data.result[1];
		app.store3 = data.result[2];

		//Pass the store objects into a function to drop in the pins
		//app.mapPins(app.store1, app.store2, app.store3);

		//	POPULATE THE ADDRESS INFO ====================
		//STORE 1
		$('.address1').text(data.result[0].address_line_1);
		$('.cityPostal1').text(data.result[0].city + ', ' + data.result[0].postal_code);
		$('.phoneNumber1').text(data.result[0].telephone);
		//store hours
		var store1Hours = dayWeek(data.result[0]);
		var store1Open = msmTo12time(store1Hours[0]);
		var store1Close = msmTo12time(store1Hours[1]);
		$('.openHours1').text('Open ' + store1Open[0] + ':' + store1Open[1] + store1Open[2] + " to " + store1Close[0] + ':' + store1Close[1] + store1Close[2] + ' today');

		//STORE 2
		$('.address2').text(data.result[1].address_line_1);
		$('.cityPostal2').text(data.result[1].city + ', ' + data.result[1].postal_code);
		$('.phoneNumber2').text(data.result[1].telephone);
		//store hours
		var store2Hours = dayWeek(data.result[1]);
		var store2Open = msmTo12time(store2Hours[0]);
		var store2Close = msmTo12time(store2Hours[1]);
		$('.openHours2').text('Open ' + store2Open[0] + ':' + store2Open[1] + store2Open[2] + " to " + store2Close[0] + ':' + store2Close[1] + store2Close[2] + ' today');


		//STORE 3
		$('.address3').text(data.result[2].address_line_1);
		$('.cityPostal3').text(data.result[2].city + ', ' + data.result[2].postal_code);
		$('.phoneNumber3').text(data.result[2].telephone);
		//store hours
		var store3Hours = dayWeek(data.result[2]);
		var store3Open = msmTo12time(store3Hours[0]);
		var store3Close = msmTo12time(store3Hours[1]);
		$('.openHours3').text('Open ' + store3Open[0] + ':' + store3Open[1] + store3Open[2] + " to " + store3Close[0] + ':' + store3Close[1] + store3Close[2] + ' today');
		
		//run a function that determines which location is pressed then displays the booze
		app.storeSelector();

		app.initMap(app.store1, app.store2, app.store3);
		app.codeAddress(app.postal);
		
		
	}); //end results function
}; // end stores function
// =============================================================================
// STORE SELECTOR LISTENER
// =============================================================================
app.storeSelector = function(){
	$('.store1').on('click', function(){
		$('.store-location').text(app.store1.address_line_1).fadeIn();
		app.promoBooze(app.store1, 'beer', 'wine', 'spirits');
	});
	$('.store2').on('click', function(){
		$('.store-location').text(app.store2.address_line_1).fadeIn();
		app.promoBooze(app.store2, 'beer', 'wine', 'spirits');
	});
	$('.store3').on('click', function(){
		$('.store-location').text(app.store3.address_line_1).fadeIn();
		app.promoBooze(app.store3, 'beer', 'wine', 'spirits');
	});
}; //end store selector function

// =============================================================================
// OPENING HOURS FUNCTION
// =============================================================================
//the api returns time in minutes since midnight...therfore we must convert them to 12hr time
//we pass in the store object so we can see the times they open and close each day
function dayWeek(store){
	var start = new Date();
	var today = start.getDay();
	console.log(today);
	//javascript has a built in function to tell you the day of the week 0-6 is sun-sat
	//get the day of the week and display the result
	//this is a switch statement....it's like an if/else statement but cleaner looking when you have so many cases!
	switch (today){
		case 0:
			//so in this case dayweek() will return the open and close times for the passed in store as an array
			console.log('sunday');
			return [store.sunday_open, store.sunday_close];
		case 1:
			console.log('monday');
			return [store.monday_open, store.monday_close];
		case 2:
			console.log('tuesday');
			return [store.tuesday_open, store.tuesday_close];
		case 3:
			console.log('wednesday');
			return [store.wednesday_open, store.wednesday_close];
		case 4:
			console.log('thursday');
			return [store.thursday_open, store.thursday_close];
		case 5:
			console.log('friday');
			return [store.friday_open, store.friday_close];
		case 6:
			console.log('saturday');
			return [store.saturday_open, store.saturday_close];
	}//end of switch statement
} //end dayweek function

//this function takes the minutes since midnight and creates a time based on a 24 hour clock
function msmTo24time(msm) {
  var hour = msm / 60;
  var mins = msm % 60;
  //returns an array of hours and minutes
  return [hour, mins];
}
//this function takes the minutes since midnight and returns a 12 hour clock in an array of [HOURS, MINUTES, AM/PM]
function msmTo12time(msm) {
	var time = msmTo24time(msm);
	var h24  = time[0];
	var h12  = (0 === h24 ? 12 : (h24 > 12 ? (h24 - 10) - 2 : h24));
	h12 = Math.floor(h12);
	var ampm = (h24 >= 12 ? 'PM' : 'AM');
	var mins = '';
	//if minutes is 0 make it 00
	if (time[1] === 0){
		mins = '00';
	}else{
		mins = time[1];
	}
	// returns hours, minutes and am or pm in an array
	return [h12, mins, ampm];
}// end opening hours function



// =============================================================================
// PRODUCTS FUNCTION : returns the products on promotion
// =============================================================================

//this function is passed a store and finds the 5 beers with the most airmiles reward miles
app.promoBooze = function(store, beer, wine, spirits){

	//store the 3 calls in promises
	var beerPromise = $.ajax({
		url: 'http://lcboapi.com/products',
		type: 'GET',
		dataType: 'jsonp',
		data: {
			access_key: app.jamesAPI,
			per_page: 10,
			where: 'has_bonus_reward_miles',
			where_not: 'is_dead',
			order: 'bonus_reward_miles',
			q: beer
		}
	});
	var winePromise = $.ajax({
		url: 'http://lcboapi.com/products',
		type: 'GET',
		dataType: 'jsonp',
		data: {
			access_key: app.jamesAPI,
			per_page: 10,
			where: 'has_bonus_reward_miles',
			where_not: 'is_dead',
			order: 'bonus_reward_miles',
			q: wine
		}
	});
	var spiritsPromise = $.ajax({
		url: 'http://lcboapi.com/products',
		type: 'GET',
		dataType: 'jsonp',
		data: {
			access_key: app.jamesAPI,
			per_page: 10,
			where: 'has_bonus_reward_miles',
			where_not: 'is_dead',
			order: 'bonus_reward_miles',
			q: spirits
		}
	});


	//pass those promises when loaded into a .when.done function
	$.when.apply($, [beerPromise, winePromise, spiritsPromise] )
		.done(function(beerData, wineData, spiritsData){
			console.log(beerData[0].result);
			console.log(wineData[0].result);
			console.log(spiritsData[0].result);

			var beerArray = beerData[0].result;
			var wineArray = wineData[0].result;
			var spiritsArray = spiritsData[0].result;

			var boozeItems = beerArray.concat(wineArray, spiritsArray);
			//console.log(boozeItems);
			//pass the resulting array of booze objects into a function to check the stock and pass in the store from before
			app.inStock(boozeItems, store);
		})//done callback
		.fail(function(error){
			console.log(error);
		});

	//.then(function(data) {
		//console.log('Beers on promotion!!');
		//console.log the 5 beers found
		//console.log(data.result);
		//var boozeItems = data.result;
		//pass the resulting array of booze objects into a function to check the stock and pass in the store from before
		//app.inStock(boozeItems, store);
	//});//end results function
	
}; //end promoBooze function


// =============================================================================
// INVENTORY FUNCTION : returns store inventory
// =============================================================================
app.inStock = function(items, store){
	console.log('inStock fired');
	console.log(items);
	console.log(store);
	//default flickity stuff to get it working
	var $gallery = $('.gallery').flickity();
	$gallery.flickity( 'select', 2 );
	//remove old gallery-cells before adding new ones!
	$gallery.flickity('remove', $('.gallery-cell'));
	//for each product on promotion we check the stock at the store
	$.each(items, function(index, value){
		$.ajax({
			url: 'http://lcboapi.com/stores/' + store.id + '/products/' + items[index].id + '/inventory',
			type: 'GET',
			dataType: 'jsonp',
			data: {
				access_key: app.jamesAPI,
			}
		}).then(function(data) {
			console.log(data);
			//now we have the stock of the items on promo at the closest store....lets display it!
			console.log('This is the inventory of ' + items[index].name + ' at ' + store.address_line_1 + ", " + store.city );
			// so if the quantity is greater than 0 and there is a picture display it!
			if (( data.result.quantity > 0 ) && (value.image_url)){
				console.log(data.result.quantity);

				//construct flickity slide
				var itemImg = $('<img>').attr('src', value.image_url);
				var itemName = $('<p>').text(value.name);
				var itemMiles = $('<span>').html('<p class="bonus-number">' + value.bonus_reward_miles +'</p>'+ '<p>BONUS</p><p>MILES</p>').addClass("reward-miles");
				var itemPackage = $('<p>').text(value.package);

				var itemPrice = $('<p>').text('$' + ((value.price_in_cents / 100).toFixed(2)));

				var galleryCell = $('<div>').addClass('gallery-cell').append(itemImg, itemName, itemMiles, itemPackage, itemPrice);

				//append the new gallery-cells into the gallery
				
				$gallery.flickity('append', galleryCell);
				//reload sizes of flickity
				$gallery.flickity('reposition');
				$gallery.flickity('resize');
				
			}else if ( ( data.result.quantity <= 0 ) || (!data.result) ){
				console.log('Sorry not in stock!');
			}
		}); //end results function
	});//end each loop
};//instock function

// =============================================================================
// GOOGLE MAPS FUNCTIONS
// =============================================================================
//declare variables to hold the 3 markers
var marker;
var marker2;
var marker3;
var geocoder;
var map;
//take the address entered and drop a pin
app.codeAddress = function(address) {
	geocoder = new google.maps.Geocoder();
    geocoder.geocode( { 'address': address}, function(results, status) {
    	console.log(results);
      if (status == google.maps.GeocoderStatus.OK) {
        map.setCenter(results[0].geometry.location);
        var location = new google.maps.Marker({
            map: map,
            icon: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png',
            animation: google.maps.Animation.DROP,
            position: results[0].geometry.location
        });
      } else {
        alert("Geocode was not successful for the following reason: " + status);
      }
    });
  }; //codeAddress
//pass in current location and closets 3 stores
app.initMap = function(store1, store2, store3) {
  	map = new google.maps.Map(document.getElementById('googleMap'), {
    zoom: 12,
    scrollwheel: false,
    center: {lat: store1.latitude, lng: store1.longitude}
  });

  marker = new google.maps.Marker({
    map: map,
    draggable: true,
    animation: google.maps.Animation.DROP,
    position: {lat: store1.latitude, lng: store1.longitude}
  });
  marker2 = new google.maps.Marker({
    map: map,
    draggable: true,
    animation: google.maps.Animation.DROP,
    position: {lat: store2.latitude, lng: store2.longitude}
  });
  marker3 = new google.maps.Marker({
    map: map,
    draggable: true,
    animation: google.maps.Animation.DROP,
    position: {lat: store3.latitude, lng: store3.longitude}
  });
  marker.addListener('click', toggleBounce);
};//end initMap

//bounce animation
function toggleBounce() {
  if (marker.getAnimation() !== null) {
    marker.setAnimation(null);
  } else {
    marker.setAnimation(google.maps.Animation.BOUNCE);
  }
} //bounce function

// =============================================================================
// INIT FUNCTION
// =============================================================================
app.init = function(){
	app.locationListener();
	
}; // end init function

// =============================================================================
// DOC READY RUN app.init()
// =============================================================================
$(function(){
	console.log('document ready!');
	app.init();
}); // end document ready



