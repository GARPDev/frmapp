phonecatApp.service('GarpAnalytics', ['$rootScope', '$analytics', 'remoteDataService', '$location', '$window', 
function ($rootScope, $analytics, remoteDataService, $location, $window){

    var submitPage = function(url){
        $analytics.pageTrack(url, $location)
    }

    var setPageDimensions = function(){

    }

    $rootScope.$on('$routeChangeSuccess', function (event, current) {
        if (current && (current.$$route||current).redirectTo) return;
        var url = $window.location.pathname + $location.url();
        console.log(url)
    })

}])