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

    $scope.location = {}

    $scope.$on('$routeChangeSuccess', function(event, current, previous){
      $scope.location.current = current.$$route.originalPath
    })

    function setState() {

      var currentMenuItem

      switch(document.location.hash) {
        case '#!/readings':
          currentMenuItem = 'Readings';
          break;
        case '#!/examsettings':
          currentMenuItem = 'Tests';
          break;
        case '#!/dashboard':
          currentMenuItem = 'Dashboard';
          break;
        case '#!/examday':
          currentMenuItem = 'Exam Details';
          break;
        case '#!/messages':
          currentMenuItem = 'Messages';
          break;
        case '#!/glossary':
          currentMenuItem = 'Glossary';
          break;
        default:
          currentMenuItem = 'Dashboard';
          break;
      }

      $scope.active = { menuItem: currentMenuItem }

    }
    setState();

    $scope.enableNav = false;
    $scope.$on("enableNav", function (event, loggedIn) {
      $scope.enableNav = loggedIn;
    });

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
      $rootScope.$broadcast('enableNav', false);
      navigationService.changeView('login');
    }


    $scope.isOnline = function() {
      return isOnline();
    }

    $scope.openMessage = function(msg) {
        $scope.currentMessage = msg;
        $("#msgModal").modal();
    }

    $scope.searchGlossary = function(terms) {
      remoteDataService.searchTerms = terms;
      $scope.changeView('glossary');
    }

    $scope.changeView = function(view) {
      navigationService.changeView(view);
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
