frmServices.factory('utilitiesService', ['$resource',
  function($resource){

    var utilitiesService = {};

    utilitiesService.formatExamName = function(examName) {
      if(defined(examName)) {
        if(examName.indexOf('FRM') > -1) {
          if(examName == 'FRM Part 1')
            return 'FRM Exam Part I';
          if(examName == 'FRM Part 2')
            return 'FRM Exam Part II';
        } else {
          return examName;
        }
      } else {
        return '';
      }

    }

    return utilitiesService;

}]);