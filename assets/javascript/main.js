  //  $(document).ready(function() {
  //      $('.carousel').carousel();
  //  });

  $(document).ready(function() {
      $("#results").hide();
      $(".dropdown-button").dropdown();
      var carousel_interval = 1000;
      $('.carousel').carousel();
      var int;

      function run() {
          int = setInterval(function() {
              $('.carousel').carousel('next');
          }, carousel_interval);
      }

      function stop() {
          clearInterval(int);
      }
      $('.carousel').hover(stop, run);
      // this is the api call for the trails

  });

  $("#explore").on("click", function() {
      $("#home").hide();
      $("#results").show();
      var city = $('#destination').val().trim();
      console.log(city)
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



          var weather = {
              "async": true,
              "crossDomain": true,
              "url": "http://api.wunderground.com/api/d04d4a5c28ba5311/conditions/q/" + city + ".json",
              "method": "GET"
          }

          $.ajax(weather).done(function(response) {
              console.log(response);
          });
      });
  });
