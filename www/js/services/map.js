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

      if(typeof google !== "undefined") {

        try {
          map = new google.maps.Map(document.getElementById(selector), mapOptions);          
        } catch(err) {
          $('#'+selector).innerHTML = ' Geocode was not successful for the following reason: ' + err;
          callback(500, status);
        }

        geocoder = new google.maps.Geocoder();      

        geocoder.geocode( { 'address': address}, function(results, status) {

          mapService.status = status;

          if (status == google.maps.GeocoderStatus.OK) {
            map.setCenter(results[0].geometry.location);
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

    }

    return mapService;

  }
]);
