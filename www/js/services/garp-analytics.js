phonecatApp.service('GarpAnalyticsService', ['$rootScope', '$analytics', 'remoteDataService', '$location', '$window', 
function ($rootScope, $analytics, remoteDataService, $location, $window){

    var PageTracking = this.PageTracking = {

        /**
         * Can be set to false explicitly in the resolve function 
         * associated with a given route to turn off automatic page tracking
         * @param {boolean} autoPageTrackingOn 
         */
        autoPageTrackingOn: true,

        /**
         * Sends the page information to GA
         * @param {string} url
         * @function
         */
        doPageTrack: function(url){
            $analytics.pageTrack(url, $location)
        },

        /**
         * Defines the dimensions object and provides a means for overriding
         * hardcoded dimensions
         * @param {kwargs} overrides e.g. { 'Content-Type' : 'Custom Content Type Value' }
         * @function
         * @return {kwargs}
         */
        definePageDimensions: function(overrides){

            //Model definition with hardcoded dimension
            var dimensions = {
                'Content-Type'  : { dimensionIndex: 1, value: null },
                'User-Type'     : { dimensionIndex: 3, value: null },
                'Load Time'     : { dimensionIndex: 4, value: null },
                'URL'           : { dimensionIndex: 8, value: $location.absUrl() },
                'App'           : { dimensionIndex: 9, value: 'Study Center App' }
            }

            //Computed dimensions
            if(remoteDataService.examInfo !== undefined && remoteDataService.examInfo.EXAM){
                dimensions['Content-Type'].value = remoteDataService.examInfo.EXAM
            }
            if(remoteDataService.userData !== undefined && remoteDataService.userData.contact !== undefined && remoteDataService.userData.contact.Membership_Type__c){
                dimensions['User-Type'].value = remoteDataService.userData.contact.Membership_Type__c
            }

            //Overrides
            if(overrides){
                for(var property in overrides){
                    if(dimensions.hasOwnProperty(property)) dimensions[property].value = overrides[property]
                }
            }

            return dimensions

        },

        /**
         * Iterates over dimensions and sets them on the $analytics service
         * Using the $analytics.setUserProperties function
         * @param {kwargs} dimensions
         * @function
         */
        setPageDimensions: function(dimensions){

            for(var key in dimensions){
                if(dimensions[key]){
                    $analytics.setUserProperties({ ['dimension' + dimensions[key].dimensionIndex] : dimensions[key].value })
                }
            }

        }

    }

    /**
     * Tracks route changes automatically
     */
    $rootScope.$on('$routeChangeSuccess', function (event, current){
        if(PageTracking.autoPageTrackingOn){
            PageTracking.setPageDimensions(PageTracking.definePageDimensions())
            PageTracking.doPageTrack($location.absUrl())
        }
    })

}])