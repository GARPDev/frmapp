frmServices.factory('mapService', ['$resource','$http',
  function($resource, $http){


    var mapService = {};
    mapService.status = "pending";

    var geocoder;
    var map;
    var mapOptions = {
        zoom: 8
      };

    mapService.displayMap=function(selector, address, callback) {

      $('#map-debug').empty().text('In displayMap: ' + google + ':' + document.getElementById(selector));

      map = new google.maps.Map(document.getElementById(selector), mapOptions);

      $('#map-debug').empty().text('Get Map');

      geocoder = new google.maps.Geocoder();

      $('#map-debug').empty().text('Get geocoder');
      
      geocoder.geocode( { 'address': address}, function(results, status) {

        $('#map-debug').empty().text('Call geocoder');

        mapService.status = status;

        if (status == google.maps.GeocoderStatus.OK) {

          $('#map-debug').empty().text('Call setCenter');

          map.setCenter(results[0].geometry.location);

          $('#map-debug').empty().text('New marker');

          var marker = new google.maps.Marker({
              map: map,
              position: results[0].geometry.location
          });
          callback(null, status);
        } else {
          $('#'+selector).innerHTML = ' Geocode was not successful for the following reason: ' + status;
          callback(500, status);
        }

      });
    }

    return mapService;

  }
]);
