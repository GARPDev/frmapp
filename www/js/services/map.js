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

      $('#map-debug').empty().text('In displayMap');

      if(typeof google === "undefined") {
        $('#map-debug').empty().text('No Google');
      } else {
        $('#map-debug').empty().text('Yes Google');
      }

      // map = new google.maps.Map(document.getElementById(selector), mapOptions);

      // $('#map-debug').empty().text('Get Map');

      // geocoder = new google.maps.Geocoder();
      
      // geocoder.geocode( { 'address': address}, function(results, status) {

      //   mapService.status = status;

      //   if (status == google.maps.GeocoderStatus.OK) {
      //     map.setCenter(results[0].geometry.location);
      //     var marker = new google.maps.Marker({
      //         map: map,
      //         position: results[0].geometry.location
      //     });
      //     callback(null, status);
      //   } else {
      //     $('#'+selector).innerHTML = ' Geocode was not successful for the following reason: ' + status;
      //     callback(500, status);
      //   }

      // });
    }

    return mapService;

  }
]);
