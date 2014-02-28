frmServices.factory('mapService', ['$resource','$http',
  function($resource, $http){


    var mapService = {};

    var geocoder;
    var map;
    var mapOptions = {
        zoom: 8
      };

    mapService.displayMap=function(selector, address) {
      map = new google.maps.Map(document.getElementById(selector), mapOptions);
      geocoder = new google.maps.Geocoder();
      
      geocoder.geocode( { 'address': address}, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
          map.setCenter(results[0].geometry.location);
          var marker = new google.maps.Marker({
              map: map,
              position: results[0].geometry.location
          });
        } else {
          $('#'+selector).innerHTML = ' Geocode was not successful for the following reason: ' + status;
        }
      });

    }

    return mapService;

  }
]);
