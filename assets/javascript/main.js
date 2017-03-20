  //  $(document).ready(function() {
  //      $('.carousel').carousel();
  //  });
  function initMap() {
      var uluru = { lat: -25.363, lng: 131.044 };
      var map = new google.maps.Map(document.getElementById('map'), {
          zoom: 4,
          center: uluru
      });
      var marker = new google.maps.Marker({
          position: uluru,
          map: map
      });
  }
  // Autocomplete API
  var placeSearch, autocomplete;
  var componentForm = {
      street_number: 'short_name',
      route: 'long_name',
      locality: 'long_name',
      administrative_area_level_1: 'short_name',
      country: 'long_name',
      postal_code: 'short_name'
  };

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

  $(document).ready(function() {
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

      // this is the api call for the trails



      $("#explore").on("click", function() {
          $("#home").hide();
          $("#results").show();
          var stateCity = $('#autocomplete').val().trim();

          initMap();
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
              console.log(city);
              var carouselDiv = $('<div>').addClass('carousel');
              for (var i = 0; i < 10; i++) {
                  if (response.places[i].activities[0]) {
                      console.log(response.places[i].activities[0].thumbnail)
                      var carouselImg = $('<img>').attr('src', response.places[i].activities[0].thumbnail);
                      var carouselAtag = $('<a>').addClass("carousel-item");
                      carouselAtag.append(carouselImg).appendTo(carouselDiv);
                  }
              }
              carouselDiv.appendTo('#carousel');

              $('.carousel').carousel({ duration: 1000 });
              $('.carousel').hover(stop, run);



              var weather = {
                  "async": true,
                  "crossDomain": true,
                  "url": "http://api.wunderground.com/api/d04d4a5c28ba5311/conditions/q/" + stateCity + ".json",
                  "method": "GET"
              }

              $.ajax(weather).done(function(response) {
                  console.log(response);
                  console.log(response.current_observation.temp_f);
                  console.log(response.current_observation.display_location.city);
                  console.log(response.current_observation.icon_url);
                  console.log(response.current_observation.local_time_rfc822);
                  console.log(response.current_observation.weather);
                  var weatherDiv = $('<div>').addClass('weatherDiv');
                  var weatherImg = $('<img>').addClass('weatherImg').attr('src', response.current_observation.icon_url);
                  weatherDiv.append(weatherImg).appendTo('.card-image');
                  var currentWeather = $('<div>').addClass('currentWeather');
                  var currentTemp = $('<p>').addClass('currTemp').text('temp:' + response.current_observation.temp_f);
                  var currentLocation = $('<p>').addClass('location').text(response.current_observation.display_location.city);
                  var time = $('<p>').addClass('localTime').text(response.current_observation.local_time);
                  var forcast = $('<p>').addClass('forcast').text('forcast:' + response.current_observation.weather);
                  currentWeather.append(currentLocation, currentTemp, forcast).appendTo(".card-content");
              });
          });
      });
  });
