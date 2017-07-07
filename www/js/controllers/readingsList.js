frmControllers.controller('FRMAppReadingsListCtrl', ['$scope', '$window', '$timeout', 'scheduleBarSharedService', 'remoteDataService', 'readlingListSharedService', '$filter',
    function($scope, $window, $timeout, scheduleBarSharedService, remoteDataService, readingListSharedService, $filter) {

        $scope.readingsList = readingListSharedService
        $scope.isMobile = isMobile();

        //$scope.lessons = Lessons.query();
        $scope.lessons = remoteDataService.lessonData;
        $scope.lessonIndex = scheduleBarSharedService.lessonIndex;

        if (scheduleBarSharedService.lessonIndex == 'all') {
            $scope.currentLesson = {
                id: 'all',
                title: 'All Readings'
            };
            $scope.readings = _.flatten(_.pluck(remoteDataService.lessonData, 'readings'))
            //$scope.readings = _.reject(allReadings, function(ar){ return typeof ar.id === "undefined"; });
        } else {
            $scope.currentLesson = _.findWhere(remoteDataService.lessonData, {
                id: $scope.lessonIndex
            });
            $scope.readings = $scope.currentLesson.readings
        }

        $scope.$on('handleTopicSelectItem', function() {
            if ($scope.lessonIndex != scheduleBarSharedService.lessonIndex) {

                $scope.lessonIndex = scheduleBarSharedService.lessonIndex;

                if ($scope.lessonIndex == 'all') {
                    $scope.currentLesson = {
                        id: 'all',
                        title: 'All Readings'
                    };
                    $scope.readings = _.flatten(_.pluck(remoteDataService.lessonData, 'readings'))
                    //$scope.readings = _.reject(allReadings, function(ar){ return typeof ar.id === "undefined"; });

                } else {
                    var lesson = _.findWhere(remoteDataService.lessonData, {
                        id: $scope.lessonIndex
                    });
                    if (lesson !== null && typeof lesson !== "undefined") {
                        $scope.currentLesson = lesson;
                        $scope.readings = lesson.readings;
                    }
                }
            }
        });

        function onConfirm() {
            console.log("confirm");
        }

        // Readings List
        $scope.itemClicked = function(id, type) {
            readingListSharedService.setReadingIndex(id);
            remoteDataService.toggelReadingAttribute(id, type);
        };

        $scope.openReading = function(reading) {
            var isFRM = false;
            var isERP = false;
            var src = reading.url;

            // 1. check if its FRM or ERP
            if (reading.exam.indexOf("FRM") > -1) {
                isFRM = true;
            } else if (reading.exam.indexOf("ERP") > -1) {
                isERP = true;
            };

            // 2. only OPEN ERPs and online reading
            if (($scope.isMobile && isERP)) {
                var ref = cordova.InAppBrowser.open(src, '_blank', 'location=yes');
            } else if ((!$scope.isMobile && isERP)) {
                $window.open(src);
            } else if (($scope.isMobile && isFRM)) {
                // Prompt that this feature is NOT available on MOBILE.
                $window.open(src);

                // navigator.notification.confirm(
                //     'This feature is currenlty disabled on Mobile.', // message
                //     onConfirm, // callback to invoke with index of button pressed
                //     'Feature Disabled', // title
                //     ['ok'] // buttonLabels
                // );

            } else if ((!$scope.isMobile && isFRM)) {
                $window.open(src);
            } else if (($scope.isMobile && reading.is_An_Online_Reading)) {
                var ref = cordova.InAppBrowser.open(src, '_blank', 'location=yes');
            } else {
                $window.open(src);
            }
        }

        $scope.isItemClicked = function(id, type) {

            var foundItem = remoteDataService.getReadingByID(id);
            if (foundItem === null || typeof foundItem === "undefined") {
                return false;
            } else {
                return foundItem[type];
            }

        }

        $scope.getSelectedLessonIndex = function($index) {
            return scheduleBarSharedService.lessonIndex;
        }

        $scope.getNumberOfNotes = function(id) {

            var foundItem = remoteDataService.getReadingByID(id);
            if (foundItem !== null && typeof foundItem !== "undefined" &&
                foundItem.notes !== null && typeof foundItem.notes !== "undefined") {
                return foundItem.notes.length;
            } else {
                return 0;
            }
        }

    }
])

frmControllers.filter('filterByReadingListProps', ['remoteDataService', function(remoteDataService) {
    return function(input, filter, property) {

        var output = []

        if (filter !== undefined && filter) {

            angular.forEach(input, function(item) {
                angular.forEach(remoteDataService.metaData, function(metadata) {

                    if (metadata.readingId == item.id && !Array.isArray(metadata[property]) && metadata[property]) {
                        output.push(item)
                    } else if (metadata.readingId == item.id && Array.isArray(metadata[property]) && metadata[property].length) {
                        output.push(item)
                    }

                })
            })

        } else {

            output = input

        }

        return output

    }
}])