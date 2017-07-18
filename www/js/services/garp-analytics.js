phonecattApp.service('garpAnalytics', ['$rootScope', '$analytics', 'remoteDataService', '$location', function ($rootScope, $analytics, remoteDataService, $location){

    var submitPage = function(url){
        $analytics.pageTrack(url, $location)
    }

    var setPageDimensions = function(){



    }

    $rootScope.$on('$routeChangeSuccess', function (event, current) {
        if (current && (current.$$route||current).redirectTo) return;
        var url = $analytics.settings.pageTracking.basePath + $location.url();
        console.log()
    })

}])