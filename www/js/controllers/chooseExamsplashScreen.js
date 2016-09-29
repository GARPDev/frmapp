frmControllers.controller('ChooseExamCtrl', ['$scope','$timeout','$location','remoteDataService','navigationService', 'authenticationService',
	function($scope,$timeout,$location,remoteDataService,navigationService, authenticationService) {

		$scope.selectExam = function(exam) {
			if(exam == "erp"){
				remoteDataService.exam = 'erp';
				remoteDataService.EXAM = 'ERP';
			} else if("frm"){
				remoteDataService.exam = 'frm';
				remoteDataService.EXAM = 'FRM';
			};
			navigationService.changeView('myaccount');
		};

		$scope.changeView = function(view) {
			navigationService.changeView(view);
		}

	}
	]);
