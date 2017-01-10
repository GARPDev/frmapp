frmControllers.controller('ChooseExamCtrl', ['$scope','$timeout','$location','remoteDataService','navigationService', 'authenticationService','$rootScope',
	function($scope,$timeout,$location,remoteDataService,navigationService, authenticationService, $rootScope) {

		$scope.selectExam = function(exam) {
			if(exam == "erp"){
				remoteDataService.examInfo.exam = 'erp';
				remoteDataService.examInfo.EXAM = 'ERP';
			} else if("frm"){
				remoteDataService.examInfo.exam = 'frm';
				remoteDataService.examInfo.EXAM = 'FRM';
			}

			remoteDataService.examInfo.userExamPart = 3;

			localStorage.removeItem('readingData');
			remoteDataService.readingData = null;

			localStorage.removeItem('questionsReadingsData');
			remoteDataService.questionsReadingsData = null;

			localStorage.removeItem('questionData');
			remoteDataService.questionData = null;

			localStorage.removeItem('glossaryData');
			remoteDataService.glossaryData = null;
			
			navigationService.changeView('myaccount');
			$rootScope.$broadcast('updateNav', true);
		};

		$scope.changeView = function(view) {
			navigationService.changeView(view);
		}

	}
	]);
