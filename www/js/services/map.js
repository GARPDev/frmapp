frmServices.factory('mapService', ['$resource', '$http',
  function ($resource, $http) {


        var mapService = {};
        mapService.status = "pending";

        var geocoder;
        var map;
        var mapOptions = {
            options: {
                styles: [
                    {
                        "elementType": "geometry.fill",
                        "stylers": [
                            {
                                "visibility": "on"
                            },
                            {
                                "weight": 0.5
                            },
                            {
                                "saturation": 100
                            },
                            {
                                "lightness": 1
                            },
                            {
                                "color": "#e7e7e7"
                            }
                        ]
                    }, {
                        "elementType": "labels.text",
                        "stylers": [
                            {
                                "lightness": 1
                            },
                            {
                                "color": "#0E6386"
                            },
                            {
                                "weight": 0.3
                            }
                        ]
                    }, {
                        "featureType": "water",
                        "stylers": [
                            {
                                "color": "#3FACDB"
                            }
                        ]
                    }, {
                        "featureType": "road.highway",
                        "elementType": "geometry",
                        "stylers": [
                            {
                                "color": "#000000"
                            },
                            {
                                "weight": 0.3
                            }
    ]
                    }


                ],
                zoom: 8
            }
        }

        mapService.displayMap = function (selector, address, callback) {

            if (typeof google !== "undefined") {

                try {
                    map = new google.maps.Map(document.getElementById(selector), mapOptions);
                    //just added
                    var contentString = "Location of your exam.";
                    var infowindow = new google.maps.InfoWindow({
                        content: contentString
                    });
                } catch (err) {
                    $('#' + selector).innerHTML = ' Geocode was not successful for the following reason: ' + err;
                    callback(500, status);
                }

                geocoder = new google.maps.Geocoder();

                geocoder.geocode({
                    'address': address
                }, function (results, status) {

                    mapService.status = status;

                    if (status == google.maps.GeocoderStatus.OK) {
                        map.setCenter(results[0].geometry.location);
                        var marker = new google.maps.Marker({
                            map: map,
                            icon: 'img/garp_marker.png',
                            title: 'Exam',
                            animation: google.maps.Animation.DROP,
                            position: results[0].geometry.location
                        });
                        google.maps.event.addListener(marker, 'click', function() {
    infowindow.open(map,marker);
  });
                        callback(null, status);
                    } else {
                        $('#' + selector).innerHTML = ' Geocode was not successful for the following reason: ' + status;
                        callback(500, status);
                    }

                });
            }

        }

        return mapService;

  }
]);