frmServices.factory('scheduleBarSharedService', function($rootScope) {
  var sharedService = {};

  sharedService.lessonIndex = null;
  sharedService.readingIndex = 0;
  sharedService.allMode = false;
  
  sharedService.selectItem = function(item) {
    sharedService.lessonIndex = item;
    $rootScope.$broadcast('handleTopicSelectItem');
  };

  sharedService.doneReadingItem = function(item) {
  sharedService.readingIndex = item;
    $rootScope.$broadcast('handleDoneReadingItem');
  };
    
  return sharedService;
});

frmServices.factory('readlingListSharedService', function($rootScope) {
  var sharedService = {};
  sharedService.filters = {
    flagged: 0,
    checked: 0
  };
  sharedService.readingIndex = "";

  sharedService.setReadingIndex = function(id) {
    sharedService.readingIndex = id;
    $rootScope.$broadcast('handleSetReadingIndex');
  }

  sharedService.filterList = function(filterType) {
    sharedService.filters[filterType] = !sharedService.filters[filterType];
    $rootScope.$broadcast('handleFilterReadingList',filterType,sharedService.filters[filterType]);
  };

  sharedService.clearFilters = function() {
    sharedService.filters = {
      flagged: 0,
      checked: 0
    };

  }    
  return sharedService;
});
