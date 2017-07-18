frmControllers.controller('NavController', ['$scope', '$location','remoteDataService','navigationService','$rootScope', '$q', '$timeout',
  function($scope, $location, remoteDataService, navigationService, $rootScope, $q, $timeout) {

    $scope.innerWidth = window.innerWidth;
    $scope.innerHeight = window.innerHeight;
    $scope.searchTerms = "";
    $scope.userData = remoteDataService.userData;
    $scope.examInfo = remoteDataService.examInfo;
    $scope.currentMessage = {};
    $scope.isMobile = isMobile();
    $scope.messages = null;
    $scope.loggedIn = false;

    function setState(view) {

      if(!defined(view)) {
        var hash = document.location.hash;
        view = hash.substring(3,hash.length)
      }

      switch(view) {
        case 'readings':
          $scope.currentMenuItem = 'Readings';
          break;
        case 'examsettings':
          $scope.currentMenuItem = 'Tests';
          break;
        case 'dashboard':
          $scope.currentMenuItem = 'Dashboard';
          break;
        case 'examday':
          $scope.currentMenuItem = 'Exam Details';
          break;
        case 'messages':
          $scope.currentMenuItem = 'Messages';
          break;
        case 'glossary':
          $scope.currentMenuItem = 'Glossary';
          break;
        default:
          $scope.currentMenuItem = 'Dashboard';
          break;
      }
    }
    setState();

    $scope.$on("updateNav", function (event, loggedIn) {
      setState();
      $scope.loggedIn = loggedIn;
      $scope.userData = remoteDataService.userData;
      $scope.userImage = $scope.userData.FullPhotoUrl + '?oauth_token=' + $scope.userData.accessToken;
      $scope.examInfo = remoteDataService.examInfo;
    });    

    $scope.$on('browserResize', function() {
      $scope.innerWidth = window.innerWidth;
      $scope.innerHeight = window.innerHeight;
    });

    $scope.logout = function() {
      $rootScope.$broadcast('updateNav', false);
      if(isOnline()) {
        remoteDataService.clearData(); 
      }
      navigationService.pageTransitionOut('login');
    }


    $scope.isOnline = function() {
      return isOnline();
    }

    $scope.openMessage = function(msg) {
        $scope.currentMessage = msg;
        $("#msgModal").modal();
    }

    $scope.searchGlossary = function(terms) {
      setState('glossary');
      console.log($scope.searchTerms)
      navigationService.pageTransitionOut('glossary/' + terms)
    }

    $scope.changeView = function(view) {
      setState(view);
      navigationService.pageTransitionOut(view);
    }

    $scope.isActive = function (viewLocation) { 
        return viewLocation === $location.path();
    };    

    $scope.getEpochDateTimeText = function(epochDate) {
      return getEpochDateTimeText(epochDate);
    }

    $scope.getEpochDateShortText = function(epochDate) {
      return getEpochDateShortText(epochDate);
    }
  }
]);
