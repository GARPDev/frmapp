phonecatApp.service('GarpAnalytics', ['$rootScope', '$analytics', 'remoteDataService', '$location', '$window', 
function ($rootScope, $analytics, remoteDataService, $location, $window){

    this.autoTrackingOn = true

    var dimensions = {
        'Content-Type' : { index: 1, value: null },
        'User-Type'    : { index: 3, value: null },
        'Load Time'    : { index: 4, value: null },
        'URL'          : { index: 8, value: null },
        'App'          : { index: 8, value: 'Study Center App' }
    }

    var pageTracking = {}

    pageTracking.trackPage = function(url){
        $analytics.pageTrack(url, $location)
    }

    /**
     * Defines the 
     */
    pageTracking.definePageDimensions = function(overrides){



        if(overrides){
            for(var property in overrides){
                if(dimensions.hasOwnProperty(property)) dimensions[property].value = overrides[property]
            }
        }

        if(remoteDataService.examInfo !== undefined && remoteDataService.examInfo.EXAM){
            dimensions['Content-Type'].value = remoteDataService.examInfo.EXAM
        }

        return dimensions

    }

    var setPageDimensions = function(dimensions){
        
        $analytics.setUserProperties({ 'dimension1' : dimensions['Content-Type']    })
        $analytics.setUserProperties({ 'dimension3' : dimensions['User-Type']       })
        $analytics.setUserProperties({ 'dimension4' : dimensions['Load Time']       })
        $analytics.setUserProperties({ 'dimension8' : dimensions['URL']             })
        $analytics.setUserProperties({ 'dimension9' : dimensions['App']             })

    }

    /**
     * When route changes
     * configure custom dimensions
     * then track page
     * @function
     */
    $rootScope.$on('$routeChangeSuccess', function (event, current) {
        var customDimensions = definePageDimensions()
        setPageDimensions(customDimensions)
        pageTracking.trackPage($location.absUrl())
    })

    this.pageTracking = pageTracking

}])