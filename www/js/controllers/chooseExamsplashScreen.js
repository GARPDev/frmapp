frmControllers.controller('ChooseExamCtrl', ['$scope','$timeout','$location','remoteDataService','navigationService', 'authenticationService',
	function($scope,$timeout,$location,remoteDataService,navigationService, authenticationService) {

		$scope.selectExam = function(exam) {
			if(exam == "erp"){
				remoteDataService.examInfo.exam = 'erp';
				remoteDataService.examInfo.EXAM = 'ERP';

				remoteDataService.examInfo.userIsExamCurrent=false;
				if(defined(result,"contact.KPI_Current_Exam_Registration__c") && result.contact.KPI_Current_Exam_Registration__c.indexOf('ERP') > -1) {
					remoteDataService.examInfo.userExam = result.contact.KPI_Current_Exam_Registration__c;
					remoteDataService.examInfo.userIsExamCurrent=true;
				} else if(defined(result,"contact.KPI_Last_Exam_Registration__c") && result.contact.KPI_Last_Exam_Registration__c.indexOf('ERP') > -1) {
					remoteDataService.examInfo.userExam = result.contact.KPI_Last_Exam_Registration__c;
				}


			} else if("frm"){
				remoteDataService.examInfo.exam = 'frm';
				remoteDataService.examInfo.EXAM = 'FRM';

				remoteDataService.examInfo.userIsExamCurrent=false;
				if(defined(result,"contact.KPI_Current_Exam_Registration__c") && result.contact.KPI_Current_Exam_Registration__c.indexOf('FRM') > -1) {
					remoteDataService.examInfo.userExam = result.contact.KPI_Current_Exam_Registration__c;
					remoteDataService.examInfo.userIsExamCurrent=true;
				} else if(defined(result,"contact.KPI_Last_Exam_Registration__c") && result.contact.KPI_Last_Exam_Registration__c.indexOf('FRM') > -1) {
					remoteDataService.examInfo.userExam = result.contact.KPI_Last_Exam_Registration__c;
				}
			};

			if((remoteDataService.examInfo.userExam.indexOf('1') > -1 || remoteDataService.examInfo.userExam.indexOf('Part I') > -1) &&
	  		   (remoteDataService.examInfo.userExam.indexOf('2') > -1 || remoteDataService.examInfo.userExam.indexOf('Part II') > -1)) {
				remoteDataService.examInfo.examPart = 3;
			} else if(remoteDataService.examInfo.userExam.indexOf('1') > -1 || remoteDataService.examInfo.userExam.indexOf('Part I') > -1) {
				remoteDataService.examInfo.examPart = 1;
			} else if(remoteDataService.examInfo.userExam.indexOf('2') > -1 || remoteDataService.examInfo.userExam.indexOf('Part II') > -1) {
				remoteDataService.examInfo.examPart = 2;
			}

			navigationService.changeView('myaccount');
		};

		$scope.changeView = function(view) {
			navigationService.changeView(view);
		}

	}
	]);
