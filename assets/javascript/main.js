  //  $(document).ready(function() {
  //      $('.carousel').carousel();
  //  });

  $(document).ready(function() {
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
      var settings = {
          "async": true,
          "crossDomain": true,
          "url": "https://trailapi-trailapi.p.mashape.com/?q%5Bcity_cont%5D=denver&limit=10",
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
      });


      // weather apivar settings = {
      var settings = {
          "async": true,
          "crossDomain": true,
          "url": "http://api.wunderground.com/api/d04d4a5c28ba5311/forecast/q/CO/denver.json",
          "method": "GET",
          "headers": {
              "cache-control": "no-cache",
              "postman-token": "a7329511-332c-8bf6-6704-37ed1405df93"
          }
      }

      $.ajax(settings).done(function(response) {
          console.log(response);
      });

      // google images api

  });
