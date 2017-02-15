frmControllers.controller('FRMExamSettingsCtrl', ['$scope','$timeout','$location','examSharedService','remoteDataService','navigationService','authenticationService',
  function($scope,$timeout,$location,examSharedService,remoteDataService,navigationService,authenticationService) {

    $scope.lessons = remoteDataService.lessonData;
    $scope.userExam = authenticationService.user.contact.KPI_Current_Exam_Registration__c;
    $scope.year = new Date().getFullYear()

    var retrieveQuestions = function(questionsArr, readings){

      var readingIds = _.pluck(readings, 'id')

      var questions  = _.reject(questionsArr, function(question) {  

        return !_.intersection(readingIds, question.readings).length

      })

      return questions

    }

    var retrieveNumOfQuestions = function(){

      var year = new Date().getFullYear()

      var readings = []

      for(var lesson in remoteDataService.lessonData){
        if(remoteDataService.lessonData[lesson].readings.length){
          for(var reading in remoteDataService.lessonData[lesson].readings){
            readings.push(remoteDataService.lessonData[lesson].readings[reading].year)
          }
        }
      }

      return readings.length

    }

    $scope.isQuestions = retrieveNumOfQuestions()

    $scope.settings = {
      mode:0,
      topics:[],
      questions:1
    }

    $scope.numberOfQuestions = [1, 4, 10, 20, 30];

    $timeout(function() {
      navigationService.pageTransitionIn();
    }, 0);

    $scope.isAllSelected = function() {
      for (index = 0; index < $scope.lessons.length; ++index) {
        if($scope.lessons[index].checked==false)
          return false;
      }
      return true;

    }
    $scope.deSelectAll = function() {
      for (index = 0; index < $scope.lessons.length; ++index) {
        $scope.lessons[index].checked=false;
      }
      return true;
    }


    $scope.selectAll = function() {
      for (index = 0; index < $scope.lessons.length; ++index) {
        $scope.lessons[index].checked=true;
      }
      return true;
    }

    $scope.isSettingOn = function(type, value) {
      if(Object.prototype.toString.call( $scope.settings[type] ) == "[object Array]") {
        return ($scope.settings[type].indexOf(value)) + 1;
      } else {
        return $scope.settings[type] === value;  
      }
      
    }

    $scope.toggelSetting = function(type, value) {
      if(Object.prototype.toString.call( $scope.settings[type] ) == "[object Array]") {
        var index = $scope.settings[type].indexOf(value);
        if(index == -1)
          $scope.settings[type].push(value);
        else $scope.settings[type].splice(index, 1);
      } else {
        $scope.settings[type].push(value);
      }
    }

    $scope.saveSettings = function() {
      examSharedService.settings = $scope.settings;

      // Compile Questions
      var finalQuestions = [];
      var readingQuestions = [];

      for(var i=0; i<remoteDataService.lessonData.length; i++) {

        var lesson = remoteDataService.lessonData[i];
        var sl = _.findWhere($scope.lessons, {id: lesson.id});

        if(sl !== null && typeof sl !== "undefined" && sl.checked) {

            var readingsInTopic = lesson.readings;

            var readingsMetaDone = _.where(remoteDataService.metaData, {done: true});
            var readingsMetaFlagged = _.where(remoteDataService.metaData, {flagged: true});

            var finalReadings = readingsInTopic;

            if(_.indexOf($scope.settings.topics, "learned") > -1) {

              finalReadings = _.reject(readingsInTopic, function(reading) { 
                var fnd = _.findWhere(readingsMetaDone, {readingId: reading.id})
                return !defined(fnd);
              });              

              //finalReadings = _.intersection(readingsInTopic,readingsMetaDone);
            }

            if(_.indexOf($scope.settings.topics, "flagged") > -1) {

              finalReadings = _.reject(readingsInTopic, function(reading) { 
                var fnd = _.findWhere(readingsMetaFlagged, {readingId: reading.id})
                return !defined(fnd);
              });              

              //finalReadings = _.intersection(finalReadings,readingsMetaFlagged);
            }

            readingQuestions = _.union(readingQuestions, finalReadings);

          }

      }

      var questions = retrieveQuestions(remoteDataService.questionData.questions, readingQuestions)

      var maxQuestions = $scope.settings.questions;
      if(questions.length < maxQuestions)
        maxQuestions = questions.length;

      for(var i=0; i<maxQuestions; i++) {
        var index = Math.floor(Math.random() * (maxQuestions-i));
        finalQuestions.push(questions[index]);
        questions.splice(index,1);
      }

      examSharedService.questions = finalQuestions;                    

      if(examSharedService.questions.length == 0) {
        $("#myModal").modal();
      } else {
        $location.path('/exam');  
      }
      
    }


    $scope.selectAll();


  }
]);