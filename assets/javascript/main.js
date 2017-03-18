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
  });
