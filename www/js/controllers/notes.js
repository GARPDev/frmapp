frmControllers.controller('FRMNotesCtrl', ['$scope','scheduleBarSharedService','remoteDataService','readlingListSharedService',
  function($scope,scheduleBarSharedService,remoteDataService,readlingListSharedService) {
    
    $scope.notes = [];
    $scope.currentReading = null;

    $scope.$on('handleSetReadingIndex', function() {

      var li = scheduleBarSharedService.lessonIndex;

      if($scope.lessonIndex == 'all') {

        var allReadings = _.flatten(_.pluck(remoteDataService.lessonData,'readings'))
        var readings = _.reject(allReadings, function(ar){ return typeof ar.id === "undefined"; });        

      } else {

        var foundItem = _.findWhere(remoteDataService.lessonData, {id: scheduleBarSharedService.lessonIndex});
        if(foundItem !== null && typeof foundItem !== "undefined") {
          var readings = foundItem.readings;        
        }

      }

      var found = 0;
      var foundItem = _.findWhere(readings, {id: readlingListSharedService.readingIndex});
      if(foundItem)
        $scope.currentReading = foundItem;
      else $scope.currentReading = null;


      $scope.notes = [];
      var foundItem = _.findWhere(remoteDataService.metaData, {readingId: readlingListSharedService.readingIndex});
      if(foundItem !== null && typeof foundItem !== "undefined") {
        if(foundItem.notes !== null && typeof foundItem.notes !== "undefined") {
          $scope.notes = foundItem.notes;
        }
      }

    });

    $scope.addNote = function(note) {
      //$scope.notes.push(note);
      var foundItem = _.findWhere(remoteDataService.metaData, {readingId: readlingListSharedService.readingIndex});
      if(foundItem !== null && typeof foundItem !== "undefined") {
        if(foundItem.notes === null || typeof foundItem.notes === "undefined") {
          foundItem.notes=[];
        }
        foundItem.notes.push(note);
        $scope.notes = foundItem.notes;
      }
      remoteDataService.commitData();
      $('#addNote').val('');
    }

    $scope.deleteNote = function(note) {
      var foundItem = _.findWhere(remoteDataService.metaData, {readingId: readlingListSharedService.readingIndex});
      if(foundItem !== null && typeof foundItem !== "undefined") {
        var foundNote = _.indexOf(foundItem.Notes, note);        
        if(foundNote !== null && typeof foundNote !== "undefined") {
          foundItem.notes.splice(foundNote,1);
          $scope.notes = foundItem.notes;
          remoteDataService.commitData();
        }
        
      }

    }

  }
]);