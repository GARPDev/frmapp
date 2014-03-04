frmServices.factory('authenticationService', ['$resource','$http',
  function($resource, $http){

    var authenticationService = {};
    authenticationService.$http = $http;
    authenticationService.userName = {};
    authenticationService.userID = "";

  authenticationService.authenticateUser=function(userName,password,callback) {
    // Fake Auth!!
    var authReq = {
      userName: userName,
      password: password
    };


    $http.post('/sfdc/auth/user', authReq).success(function(data){

      if(data.totalSize > 1) {
        return callback(401,{error:"Multiple users found!"});
      }
      if(data.totalSize == 0) {
        return callback(401,{error:"Users not found!"});
      }

      authenticationService.user = data.records[0];
      callback(null, authenticationService.user);

    }).error(function(data, status, headers, config) {
      callback(status, null);
    });

  };

  return authenticationService;

}]);


