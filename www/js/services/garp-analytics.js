phonecatApp.service('GarpAnalyticsService', ['$rootScope', '$analytics', 'remoteDataService', '$location', '$window', '$http',
function ($rootScope, $analytics, remoteDataService, $location, $window, $http){

    var SalesforceActivityTracking = this.SalesforceActivityTracking = {

        insertMetadata: function(contactId, questionId, answerIndex){

            var kwargs = {
                Practice_Exam_Question__c: questionId,
                Practice_Exam_Answer_Selected__c: answerIndex
            }

            $http.post('/frmapp/user/metadata', kwargs)
            .catch(function(error){
                console.log(error)
            })

        }
        
    }

    var PageTracking = this.PageTracking = {

        loadTimeStartTimestamp: null,

        /**
         * Can be set to true/false explicitly in the resolve function 
         * associated with a given route to turn on/off automatic page tracking
         * @param {boolean} autoRouteTrackingOn 
         */
        autoRouteTrackingOn: false,

        /**
         * Can be set to true/false explicitly prior to calling a transition
         * associated with a given route to turn on/off automatic page tracking
         * @param {boolean} autoRouteTrackingOn 
         */
        autoTransitionTrackingOn: true,

        /**
         * Sends the page information to GA
         * @param {string} url
         * @function
         */
        doPageTrack: function(url){
            $analytics.pageTrack(url, $location)
            this.autoRouteTrackingOn = true
            this.autoTransitionTrackingOn = true
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
            if(
                remoteDataService.userData !== undefined && 
                remoteDataService.userData && 
                remoteDataService.userData.contact !== undefined && 
                remoteDataService.userData.contact.Membership_Type__c
            ){
                dimensions['User-Type'].value = remoteDataService.userData.contact.Membership_Type__c
            }
            if(this.loadTimeStartTimestamp){
                var then = moment(this.loadTimeStartTimestamp)
                var duration = moment.duration(moment().diff(then))
                dimensions['Load Time'].value = duration.asSeconds() + ' Seconds'
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

    $rootScope.$on('$routeChangeSuccess', function (event, current){
        if(PageTracking.autoPageTrackingOn){
            PageTracking.setPageDimensions(PageTracking.definePageDimensions())
            PageTracking.doPageTrack($location.absUrl())
        }
    })

    $rootScope.$on('pageTransitionOut', function (event, current){
        if(PageTracking.autoTransitionTrackingOn){
            PageTracking.loadTimeStartTimestamp = moment()
        }
    })

    $rootScope.$on('pageTransitionIn', function (event, current){
        if(PageTracking.autoTransitionTrackingOn){
            PageTracking.setPageDimensions(PageTracking.definePageDimensions())
            PageTracking.doPageTrack($location.absUrl())
        }
    })

}])