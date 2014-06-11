'use strict';


function defined(ref, strNames) {
    var name;
    
    if(ref === null || typeof ref === "undefined") {
      return false;
    }

    if(strNames !== null && typeof strNames !== "undefined") {
      var arrNames = strNames.split('.');
      while (name = arrNames.shift()) {        
          if (ref[name] === null || typeof ref[name] === "undefined" || !ref.hasOwnProperty(name)) return false;
          ref = ref[name];
      } 
    }
    return true;
}


require(["app", "animations", "filters", "services", "controllers", "controllers/dashboard", "controllers/exam", "controllers/examDay", "controllers/examNav", "controllers/examResults", "controllers/glossary", "controllers/login", "controllers/myAccount","controllers/navigation","controllers/navigationFooter","controllers/readings","controllers/readingsList","controllers/scheduleBar","controllers/topicPanel","controllers/topicPanelFilters"], function () {
});
