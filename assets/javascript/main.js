// Autocomplete API and global variables
var placeSearch, autocomplete;
var map;
var mapPins = [];
var lat;
var long;

var config = {
    apiKey: "AIzaSyDlROAKalBipjSv9O4KuOuytF68mfv2X-A",
    authDomain: "hiking-project.firebaseapp.com",
    databaseURL: "https://hiking-project.firebaseio.com",
    storageBucket: "hiking-project.appspot.com",
    messagingSenderId: "46073004583"
};
firebase.initializeApp(config);

var database = firebase.database();



// Autocomplete API
var placeSearch, autocomplete, map;
// Autocomplete API and global variables
var placeSearch, autocomplete;
var map;
var mapPins = [];
var lat;
var long;

function initAutocomplete() {
    // Create the autocomplete object, restricting the search to geographical
    // location types.
    autocomplete = new google.maps.places.Autocomplete(
        /** @type {!HTMLInputElement} */
        (document.getElementById('autocomplete')), {
            types: ['geocode']
        });

}

//Function for initiallizing the google map with the data from the user entered location
function initMap(lat, long) {
    initAutocomplete();
    var myCenter = { lat: lat, lng: long };
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 8,
        center: myCenter
    });
    var marker = new google.maps.Marker({
        position: myCenter,
        map: map
    });

}

//Google autocomplete function
function geocodeAddress(geocoder, resultsMap) {
    var address = document.getElementById('autocomplete').value;
    geocoder.geocode({ 'address': address }, function(results, status) {
        if (status === 'OK') {
            resultsMap.setCenter(results[0].geometry.location);
            var marker = new google.maps.Marker({
                map: resultsMap,
                position: results[0].geometry.location
            });
            $("#map").css("display", "block");
            google.maps.event.trigger(map, 'resize');
        } else {
            alert('Geocode was not successful for the following reason: ' + status);
        }

    });
}

//Function that does an API call from WeatherUnderground from the user entered data(location)
function weatherSearch(city, state) {
    var weather = {
        "async": true,
        "crossDomain": true,
        "url": "http://api.wunderground.com/api/d04d4a5c28ba5311/conditions/q/" + state + "/" + city + ".json",
        "method": "GET"
    }

    $.ajax(weather).done(function(response) {
        var weatherDiv = $('<div>').addClass('weatherDiv');
        var weatherImg = $('<img>').addClass('weatherImg').attr('src', response.current_observation.icon_url);
        weatherDiv.append(weatherImg).appendTo('.card-image');
        var currentWeather = $('<div>').addClass('currentWeather');
        var currentTemp = $('<p>').addClass('currTemp').text('Temp: ' + response.current_observation.temp_f + "°F");
        var currentLocation = $('<p>').addClass('location').text(response.current_observation.display_location.city);
        var time = $('<p>').addClass('localTime').text(response.current_observation.local_time);
        var forcast = $('<p>').addClass('forcast').text('Forecast: ' + response.current_observation.weather);
        currentWeather.append(currentLocation, currentTemp, forcast).appendTo(".card-content");


    });

}

//Function to get the longitude/latitude from the City entered for map building purposes
function mapCode(city, state) {
    var gps = {
        "async": true,
        "crossDomain": true,
        "url": "https://maps.googleapis.com/maps/api/geocode/json?address=" + city + state + "&key=AIzaSyBBQY0MUaBs7yxoQ7FttjPHizkx86YqrMc",
        "method": "GET"
    }
    $.ajax(gps).done(function(response) {
        lat = parseFloat(response.results[0].geometry.location.lat);
        long = parseFloat(response.results[0].geometry.location.lng);
        initMap(lat, long);
    });
}

//Function that does an API call from trailAPI from the user entered data(location)
function activitySearch(city) {
    var settings = {
        "async": true,
        "crossDomain": true,
        "url": "https://trailapi-trailapi.p.mashape.com/?q%5Bcity_cont%5D=" + city + "&limit=10",
        "method": "GET",
        "headers": {
            "x-mashape-key": "8EIXIQVdijmshJoTnDa6TFps8GArp1zwCjwjsn0ng4oTPC4UUR",
            "accept": "text/plain",
            "cache-control": "no-cache",
            "postman-token": "4b9bc18d-b74a-c8c1-8e97-6d5bb32bb471"
        }
    }

    $.ajax(settings).done(function(response) {
        console.log(response);
        var carouselDiv = $('<div>').addClass('carousel');
        var pDiv = $('<p>').addClass("white-text");
        for (var i = 0; i < response.places.length; i++) {
            if (response.places[i].activities[0]) {
                var carouselImg = $('<img>').addClass('carouselImg')
                    .attr('src', response.places[i].activities[0].thumbnail)
                    .attr('data-type', response.places[i].activities[0].activity_type_name)
                    .attr('data-description', response.places[i].activities[0].description)
                    .attr('data-latitude', response.places[i].lat)
                    .attr('data-longitude', response.places[i].lon)
                    .attr('data-directions', response.places[i].directions)
                    .attr('data-name', response.places[i].activities[0].name);
                var carouselAtag = $('<a>').addClass('carousel-item');
                carouselAtag.append(carouselImg).appendTo(carouselDiv);
                // var trailName = response.places[i].activities[0].name;
                // trailName.append(pDiv).appendTo(carouselDiv);
                console.log(response.places[i].activities[0].name);

            }
        }
        carouselDiv.appendTo('#carousel');

        $('.carousel').carousel({ duration: 1000 });

    });
}




//Document ready function and where the user data actually gets grabbed
$(document).ready(function() {
    //for (i = 0; i < 21; i++) {
    //   var slideshowImg = $("<img>").addClass("bmG").attr("src", "assets/images/" + i + ".jpg");
    //    slideshowImg.appendTo("#slideshow");
    // }
    $("#slideshow").hide();
    $("#results").hide();
    $(".dropdown-button").dropdown();
    var carousel_interval = 1000;

    var int;
    //readys the carousel function
    function run() {
        int = setInterval(function() {
            $('.carousel').carousel('next');
        }, carousel_interval);
    }
    //Function that runs everything.  Once you click on explore everything takes place
    $("#explore").on("click", function() {
        run();
        $("#home").hide();
        $("#results").show();
        var stateCity = $('#autocomplete').val().trim();
        var split = stateCity.split(",");
        var city = split[0];
        var state = split[1];
        activitySearch(city);
        weatherSearch(city, state);
        mapCode(city, state);
        //Function that allows the background images to rotate and fade in/out
        $('#slideshow').show().cycle({
            fx: 'fade',
            pager: '#smallnav',
            pause: 1,
            speed: 3000,
            timeout: 5000
        });
        database.ref().push({
            city: stateCity
        });
        $('.carousel').hover(stop, run);
    });


    database.ref().on("value", function(snapshot) {
        console.log("is working");
        var city = snapshot.val();
        console.log(city);
        var cityArr = Object.keys(city);
        console.log(cityArr);
        arrLength = cityArr.length - 1;
        lastFive = (cityArr.length - 5);
        console.log(arrLength);
        console.log(lastFive);
        var search = [];
        var j = 0;
        var lastKeys = [];
        //For loop to get the last 5 recent searches
        for (var i = arrLength; i > lastFive; i--) {
            console.log("is working");
            search[j] = cityArr[i];
            j++;
        }
        var lastObjs = [];
        var displayCity = [];
        for (var i = 0; i < search.length; i++) {
            lastObjs[i] = city[search[i]];
            displayCity[i] = lastObjs[i].city;
        }
        console.log(lastObjs);
        console.log(displayCity);
        for (i = 0; i < displayCity.length; i++) {
            var newItem = $("#" + i);
            newItem.attr("data", displayCity[i]);
            var recentCity = displayCity[i];
            newItem.html(recentCity)

        }





    });

    $("#dropdown1").on("click", ".recentCity", function(event) {
        run();
        console.log("is working");
        $("#home").hide();
        $("#results").show();
        var stateCity = $(this).attr("data");
        console.log(stateCity);
        var split = stateCity.split(",");
        var city = split[0];
        var state = split[1];
        console.log(split);
        console.log(city);
        console.log(state);
        activitySearch(city);
        weatherSearch(city, state);
        mapCode(city, state);

        $('#slideshow').show().cycle({
            fx: 'fade',
            pager: '#smallnav',
            pause: 1,
            speed: 3000,
            timeout: 5000
        })
    });
});

//function that when you click on the carousel image, directions/description/pin on map pops up
$("#carousel").on('click', ".carouselImg", function(event) {
    var type = $(event.target).attr("data-type");
    var description = $(event.target).attr('data-description');
    var trailDirections = $(event.target).attr('data-directions');
    var trailName = $(event.target).attr('data-name');
    $('#info').html(type + "<br><br>" + description);
    $("#directions").html("Directions to: " + trailName + "<br><br>" + trailDirections);
    var activityLat = parseFloat($(event.target).attr('data-latitude'));
    var activityLong = parseFloat($(event.target).attr('data-longitude'));
    //Changes the google maps pin color so that the new one is a different from the main one
    var pinColor = "001fff";
    var pinImage = new google.maps.MarkerImage("http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|" + pinColor,
        new google.maps.Size(21, 34),
        new google.maps.Point(0, 0),
        new google.maps.Point(10, 34));
    var newPin = new google.maps.Marker({
        position: { lat: (activityLat), lng: (activityLong) },
        map: map,
        icon: pinImage
    });
    stop();
});
