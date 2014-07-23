frmServices.factory('authenticationService', ['$resource','$http',
  function($resource, $http){

    var authenticationService = {};
    authenticationService.$http = $http;
    authenticationService.user = {};

    
    if(localStorage.authUser !== null && typeof localStorage.authUser !== "undefined") {
      authenticationService.user = JSON.parse(localStorage.authUser);
    }

  authenticationService.authenticateUser=function(userName,password,callback) {
    
    var con = checkConnection();
    // On Web OR Mobile Online
    if(!defined(con) || (defined(con) && con !== Connection.UNKNOWN && con !== Connection.NONE)) {

      if(localStorage[localPropUserName] === userName && localStorage[localPropUserPassword] === password && defined(localStorage,"authUser")) {
        
        authenticationService.user = JSON.parse(localStorage.authUser);
        callback(null, authenticationService.user);

      } else {
        callback(401, null);
      }

    } else {

      var authReq = {
        userName: userName,
        password: password
      };

      var url = '/sfdc/auth/user';
      if(navigator.camera) {
        url = 'http://ec2-54-186-51-192.us-west-2.compute.amazonaws.com:3000' + url;
      }
      
      $http.post(url, authReq).success(function(user){

        authenticationService.user = user;
        localStorage.authUser = JSON.stringify(authenticationService.user);
        callback(null, authenticationService.user);

      }).error(function(data, status, headers, config) {
        callback(status, url);
      });
    }

  };

  return authenticationService;

}]);


