frmControllers.controller('resetPasswordCtrl', ['$scope', 'remoteDataService', function($scope, remoteDataService){

    $scope.model = { email : null }

    $scope.model.data = {}

    var isValidEmailFormat = function(email){
        var pattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        return pattern.test(email) 
    }

    $scope.resetPassword = function(){

        if($scope.model.email && isValidEmailFormat($scope.model.email)){

            remoteDataService.resetPassword($scope.model.email)
            .then(function(d){
                $scope.model.data = d.data
                console.log($scope.model.data)
            })
            .catch(function(e){
                $scope.model.data = e
                console.log($scope.model.data)
            })

        }else{

            $scope.model.data = { success : false,  messages : `The email address you have entered is invalid: "${$scope.model.email}"` }

        }

    }
    
}])