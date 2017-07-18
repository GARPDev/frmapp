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

frmServices.service('configuration', ['$location', '$window', function($location, $window) {

    var hostName = window.location.hostname;

    if (hostName.indexOf("localhost") > -1 && $location.port() == 8080) {

        this.sfdcInstaceDomain = 'c.cs13.content.force.com';
        this.portalDomain = 'preprod-mygarp.cs13.force.com';
        this.websiteDomain = 'preprod.garp.org';

        this.websiteURL = "http://" + this.websiteDomain + ":8080";
        this.publicURL = "http://" + this.portalDomain;
        this.portalURL = "https://" + this.portalDomain;

        this.paymentURL = "https://preprod-altest.cs19.force.com/chargent/SitePaymentGARP?req=";
        this.PardotRegistrationFormHandlerURL = "http://go.pardot.com/l/49402/2014-11-26/9mq3";
        this.gaId = "UA-7217990-18";
        this.mediaDom = "preprod.garp.org";
        this.AppVersionNumber = '0.14';
        this.PardotFRMRegisterRedirect = "http://live.garp.org/l/49402/2015-01-09/j7wr";
        this.PortalUser = '00540000003GGggAAG';
        this.studyAppURL = 'http://ec2-54-186-51-192.us-west-2.compute.amazonaws.com:8080/frmapp/www/index.html#!/login';


    } else if (hostName.indexOf("preprod.garp.org") > -1 && $location.port() == 8080) {


        this.sfdcInstaceDomain = 'c.cs13.content.force.com';
        this.portalDomain = 'preprod-mygarp.cs13.force.com';
        this.websiteDomain = 'preprod.garp.org';

        this.websiteURL = "http://" + this.websiteDomain + ":8080";
        this.publicURL = "http://" + this.portalDomain;
        this.portalURL = "https://" + this.portalDomain;
        this.paymentURL = "http://altest.force.com/chargent/SitePaymentGARP?req=";
        this.PardotRegistrationFormHandlerURL = "http://live.garp.org/l/49402/2015-02-23/m39w";
        this.gaId = "UA-7217990-18";
        this.mediaDom = "preprod.garp.org:8080";
        this.AppVersionNumber = '0.12';
        this.PortalUser = '00540000003GGggAAG';
        this.studyAppURL = "http://" + this.websiteDomain + "/frmapp/www/index.html#!/login";

    } else if (hostName.indexOf("preprod.garp.org") > -1) {

        this.sfdcInstaceDomain = 'c.cs13.content.force.com';
        this.portalDomain = 'preprod-mygarp.cs13.force.com';
        this.websiteDomain = 'preprod.garp.org';

        this.websiteURL = "http://" + this.websiteDomain;
        this.publicURL = "http://" + this.portalDomain;
        this.portalURL = "https://" + this.portalDomain;
        this.paymentURL = "http://altest.force.com/chargent/SitePaymentGARP?req=";
        this.PardotRegistrationFormHandlerURL = "http://live.garp.org/l/49402/2015-02-23/m39w";
        this.gaId = "UA-7217990-18";
        this.mediaDom = "preprod.garp.org";
        this.AppVersionNumber = '0.12';
        this.PortalUser = '00540000003GGggAAG';
        this.studyAppURL = "http://" + this.websiteDomain + "/frmapp/www/index.html#!/login";


    } else if (hostName.indexOf("garp.org") > -1) {

        this.sfdcInstaceDomain = 'c.na2.content.force.com';
        this.portalDomain = 'my.garp.org';
        this.websiteDomain = 'www.garp.org';

        this.websiteURL = "http://" + this.websiteDomain;
        this.publicURL = "http://" + this.portalDomain;
        this.portalURL = "https://" + this.portalDomain;
        this.paymentURL = "http://altest.force.com/chargent/SitePaymentGARP?req=";
        this.PardotRegistrationFormHandlerURL = "http://live.garp.org/l/49402/2015-02-23/m39w";
        this.gaId = "UA-7217990-1";
        this.mediaDom = "www.garp.org";
        this.AppVersionNumber = '0.12';
        this.PortalUser = '00540000003GGggAAG';
        this.studyAppURL = "http://" + this.websiteDomain + "/frmapp/www/index.html#!/login";

    } else {

        this.sfdcInstaceDomain = 'c.na2.content.force.com';
        this.portalDomain = 'my.garp.org';
        this.websiteDomain = 'www.garp.org';

        this.websiteURL = "http://" + this.websiteDomain;
        this.publicURL = "http://" + this.portalDomain;
        this.portalURL = "https://" + this.portalDomain;
        this.paymentURL = "http://altest.force.com/chargent/SitePaymentGARP?req=";
        this.PardotRegistrationFormHandlerURL = "http://live.garp.org/l/49402/2015-02-23/m39w";
        this.gaId = "UA-7217990-1";
        this.mediaDom = "www.garp.org";
        this.AppVersionNumber = '0.12';
        this.PortalUser = '00540000003GGggAAG';
        this.studyAppURL = "http://" + this.websiteDomain + "/frmapp/www/index.html#!/login";
    }

}])