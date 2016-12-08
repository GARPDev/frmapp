'use strict';

function tellAngular() {
    console.log("tellAngular call");
    var domElt = document.getElementById('view-container');
    var scope = angular.element(domElt).scope();
    if(defined(scope)) {
      scope.$apply(function() {
          scope.width = window.innerWidth;
          scope.height = window.innerHeight;
          scope.$broadcast('browserResize');
      });      
    }
}


var opts = {
  lines: 13, // The number of lines to draw
  length: 20, // The length of each line
  width: 10, // The line thickness
  radius: 30, // The radius of the inner circle
  corners: 0.5, // Corner roundness (0..1)
  rotate: 0, // The rotation offset
  direction: 1, // 1: clockwise, -1: counterclockwise
  color: '#000', // #rgb or #rrggbb or array of colors
  speed: 1, // Rounds per second
  trail: 60, // Afterglow percentage
  shadow: false, // Whether to render a shadow
  hwaccel: false, // Whether to use hardware acceleration
  className: 'spinner', // The CSS class to assign to the spinner
  zIndex: 2e9, // The z-index (defaults to 2000000000)
  top: 'auto', // Top position relative to parent in px
  left: 'auto' // Left position relative to parent in px
};

//first call of tellAngular when the dom is loaded
document.addEventListener("DOMContentLoaded", tellAngular, false);

//calling tellAngular on resize event
window.onresize = tellAngular;

var minWidth = 400; // Min width before we remove text

/* Controllers */
var frmControllers = angular.module('frmControllers', []);

frmControllers.controller('mainCtrl', ['$scope', '$rootScope','$timeout','$location','remoteDataService','navigationService','authenticationService',
  function($scope, $rootScope, $timeout, $location, remoteDataService, navigationService, authenticationService) {

    $scope.loggedIn = false;
    $scope.$on("updateNav", function (event, loggedIn) {
      $scope.loggedIn = remoteDataService.loggedIn = loggedIn;
    });    

  }
]);

