// Autocomplete API
var placeSearch, autocomplete;

function initAutocomplete() {
    // Create the autocomplete object, restricting the search to geographical
    // location types.
    autocomplete = new google.maps.places.Autocomplete(
        /** @type {!HTMLInputElement} */
        (document.getElementById('autocomplete')), {
            types: ['geocode']
        });

}

// Bias the autocomplete object to the user's geographical location,
// as supplied by the browser's 'navigator.geolocation' object.
function geolocate() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            var geolocation = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };
            var circle = new google.maps.Circle({
                center: geolocation,
                radius: position.coords.accuracy
            });
            autocomplete.setBounds(circle.getBounds());
        });
    }
}

function initMap() {
    initAutocomplete();
    var myCenter = new google.maps.LatLng('@Model.Latitude', '@Model.Longitude');
    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 8,
        center: myCenter
    });
    var geocoder = new google.maps.Geocoder();

    document.getElementById('explore').addEventListener('click', function() {
        geocodeAddress(geocoder, map);
    });

}

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

function weatherSearch(city, state) {
    var weather = {
        "async": true,
        "crossDomain": true,
        "url": "http://api.wunderground.com/api/d04d4a5c28ba5311/conditions/q/" + state + "/" + city + ".json",
        "method": "GET"
    }

    $.ajax(weather).done(function(response) {
        console.log(response);
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
        var carouselDiv = $('<div>').addClass('carousel');
        for (var i = 0; i < 10; i++) {
            if (response.places[i].activities[0]) {
                //console.log(response.places[i].activities[0].thumbnail);
                //console.log(response.places[i].activities[0].description);
                var carouselImg = $('<img>').addClass('carouselImg')
                    .attr('src', response.places[i].activities[0].thumbnail)
                    .attr('data-type', response.places[i].activities[0].activity_type_name)
                    .attr('data-description', response.places[i].activities[0].description);
                var carouselAtag = $('<a>').addClass('carousel-item');
                carouselAtag.append(carouselImg).appendTo(carouselDiv);
            }
        }
        carouselDiv.appendTo('#carousel');
    });

}


$(document).ready(function() {
    //var slideshowDiv = $("<div>").addClass("slideshow");
    //for (i = 0; i < 11; i++) {
    //    var slideshowImg = $("<img>").addClass("bmG").attr("src", "assets/images/" + i + ".jpg");
    //    slideshowImg.appendTo(slideshowDiv);
    //}
    $("#slideshow").hide();
    $("#results").hide();
    $(".dropdown-button").dropdown();
    var carousel_interval = 1000;

    var int;

    function run() {
        int = setInterval(function() {
            $('.carousel').carousel('next');
        }, carousel_interval);
    }

    function stop() {
        clearInterval(int);
    }

    $("#explore").on("click", function() {
        $("#home").hide();
        $("#results").show();
        var stateCity = $('#autocomplete').val().trim();
        var split = stateCity.split(",");
        var city = split[0];
        var state = split[1];
        $('#slideshow').show().cycle({
            fx: 'fade',
            pager: '#smallnav',
            pause: 1,
            speed: 3000,
            timeout: 5000
        });




        $('.carousel').carousel({ duration: 1000 });
        $('.carousel').hover(stop, run);
        activitySearch(city);
        weatherSearch(state, city);





    });
});


$("#carousel").on('click', ".carouselImg", function(event) {
    var type = $(event.target).attr("data-type");
    var description = $(event.target).attr('data-description')
    $('#info').html(type + "<br><br>" + description);
});
