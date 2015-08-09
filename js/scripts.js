// =============================================================================
// DECLARE GLOBAL APP OBJECT & variables
// =============================================================================

var app = {};
// james' LCBO api key
app.jamesAPI = 'MDo1ZmMzNGQ0Yy0zYWVmLTExZTUtODFkYi02YmQ0ZWM1NzJlOTQ6RDNTeEVIS1M4Zlh1M0E1UUZjMlFuRzFMWkhzbzcyeUQ2bnRN';
// james' mapbox api key
app.jamesMapbox = 'pk.eyJ1Ijoiamltc2F1cnVzIiwiYSI6IjM0NmIzMjllNGQzYzBlODY4NTQwMjlkMTA4YmM1OWIzIn0.GzyjWKJ4nnZarMZpjPCanQ';
// booze type
app.boozeType = 'spirits';


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
		
		
	}); //end results function
	
} // end stores function
// =============================================================================
// STORE SELECTOR FUNCTION
// =============================================================================
app.storeSelector = function(){
	$('.store1').on('click', function(){
		//remove old flickity cells
		app.promoBooze(app.store1, 'beer');
		app.promoBooze(app.store1, 'wine');
		app.promoBooze(app.store1, 'spirits');
	});
	$('.store2').on('click', function(){
		//remove old flickity cells
		app.promoBooze(app.store2, 'beer');
		app.promoBooze(app.store2, 'wine');
		app.promoBooze(app.store2, 'spirits');
	});
	$('.store3').on('click', function(){
		//remove old flickity cells
		app.promoBooze(app.store3, 'beer');
		app.promoBooze(app.store3, 'wine');
		app.promoBooze(app.store3, 'spirits');
	});

}





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
			break;
		case 1:
			console.log('monday');
			return [store.monday_open, store.monday_close];
			break;
		case 2:
			console.log('tuesday');
			return [store.tuesday_open, store.tuesday_close];
			break;
		case 3:
			console.log('wednesday');
			return [store.wednesday_open, store.wednesday_close];
			break;
		case 4:
			console.log('thursday');
			return [store.thursday_open, store.thursday_close];
			break;
		case 5:
			console.log('friday');
			return [store.friday_open, store.friday_close];
			break;
		case 6:
			console.log('saturday');
			return [store.saturday_open, store.saturday_close];
			break;
	}//end of switch statement
}; //end dayweek function

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
	var h12  = (0 == h24 ? 12 : (h24 > 12 ? (h24 - 10) - 2 : h24));
	h12 = Math.floor(h12);
	var ampm = (h24 >= 12 ? 'PM' : 'AM');
	//if minutes is 0 make it 00
	if (time[1] === 0){
		var mins = '00';
	}else{
		mins = time[1];
	}
	// returns hours, minutes and am or pm in an array
	return [h12, mins, ampm];
};// end opening hours function



// =============================================================================
// PRODUCTS FUNCTION : returns the products on promotion
// =============================================================================

//this function is passed a store and finds the 5 beers with the most airmiles reward miles
app.promoBooze = function(store, booze){

	$.ajax({
		url: 'http://lcboapi.com/products',
		type: 'GET',
		dataType: 'jsonp',
		data: {
			access_key: app.jamesAPI,
			per_page: 10,
			where: 'has_bonus_reward_miles',
			where_not: 'is_dead',
			order: 'bonus_reward_miles',
			q: booze
		}
	}).then(function(data) {
		//console.log('Beers on promotion!!');
		//console.log the 5 beers found
		//console.log(data.result);
		var boozeItems = data.result;
		//app.promoBeer_1 = data.result[0];
		//app.promoBeer_2 = data.result[1];
		//app.promoBeer_3 = data.result[2];
		//app.promoBeer_4 = data.result[3];
		//app.promoBeer_5 = data.result[4];
		//pass the resulting array of beer objects into a function to check the stock and pass in the store from before
		app.inStock(boozeItems, store);
	});//end results function
	
}; //end TEST function


// =============================================================================
// INVENTORY FUNCTION : returns store inventory
// =============================================================================
app.inStock = function(items, store){
	console.log('inStock fired');
	console.log(items);
	console.log(store);
	//default flickity stuff to get it working
	var $gallery = $('.gallery').flickity().flickity( 'select', 2 );
	//remove old gallery-cells before adding new ones!
	$gallery.flickity('remove', $('.gallery-cell'));
	//scroll page down to see results =====================================
    $('html, body').animate({
        scrollTop: $('#promotions').offset().top
    }, 1000);
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
				var itemMiles = $('<p>').text('Bonus reward miles: ' + value.bonus_reward_miles);
				var itemPackage = $('<p>').text(value.package);

				var itemPrice = $('<p>').text('$' + ((value.price_in_cents / 100).toFixed(2)));

				var galleryCell = $('<div>').addClass('gallery-cell').append(itemImg, itemName, itemMiles, itemPackage, itemPrice);

				//append the new gallery-cells into the gallery
				
				$gallery.flickity('append', galleryCell);

				// ===================================================================
				//scroll page down to see results =====================================
			    // $('html, body').animate({
			    //     scrollTop: $('.stores').offset().top
			    // }, 1000);
				
			}else if ( ( data.result.quantity <= 0 ) || (!data.result) ){
				console.log('Sorry not in stock!');
			}
			
		}); //end results function
	});

}//instock function

//2. (as another option)We want the user to enable "geo location" to receive their location via 
//GoogleMaps / Map Box, by clicking a button.


//3. We want to 'smooth scroll' their results (whichever method they selected) further down the page.

//4. We want to return 3 LCBO locations within their postal code parameters.

//5. We want to return a map displaying their LCBO locations using markers.

//use jquery to hide the div - > SHOW the hidden div BEFORE the map is revealed, make
//the map slide in after we have shown the div. make the div first AND THEN put the map on the page.

//6. Once a store has been selected by the user, we will 'smooth scroll' to display the airmiles promotions, further down the page.


//8. We want to display the available promotion information in a div (rgba) within the image.

//9. We want to create an option for the user to select another store.

//10. We wabt to create an option for the user to zoom to the top of the page if they wish to search again.

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
		//scroll page down to see results =====================================
	    $('html, body').animate({
	        scrollTop: $('#locations').offset().top
	    }, 1000);
	});
	//smooth scroll

}

// =============================================================================
// INIT FUNCTION
// =============================================================================
app.init = function(){
	app.locationListener();
	//LEAFLET MAPBOX
	var alexID = 'alexandradavey.n42d3egc';
	var alexMap = 'https://a.tiles.mapbox.com/v4/alexandradavey.n42d3egc/page.html?access_token=pk.eyJ1IjoiYWxleGFuZHJhZGF2ZXkiLCJhIjoiNWI5NWYzY2Q0NTQyYjYyMmFjNWY5ZWEwZGE5MjAxZWMifQ.yQUY4RtfbkaeoUlcbsxy8g#4/45.89/-75.63';
	var alexkey = 'pk.eyJ1IjoiYWxleGFuZHJhZGF2ZXkiLCJhIjoiNWI5NWYzY2Q0NTQyYjYyMmFjNWY5ZWEwZGE5MjAxZWMifQ.yQUY4RtfbkaeoUlcbsxy8g';
	L.mapbox.accessToken = alexkey;
	app.map = L.mapbox.map('map',alexID).setView([44.129, -79.306], 8);
	
}; // end init function

// =============================================================================
// DOC READY RUN app.init()
// =============================================================================
$(function(){
	console.log('document ready!');
	app.init();
}); // end document ready



