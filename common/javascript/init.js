//= require "setup-common"
//= require <jquery/jquery-1.4.2.min>
//= require <jquery/jquery-ui-1.8.custom.min>
//= require <jquery/plugins/jquery.url.packed>
//= require <jquery/plugins/jquery.cookie>
//= require <jquery/plugins/jquery.bgiframe.min>
//= require <jquery/plugins/jquery.flash>
//= require <jquery/plugins/jquery.couch>
//= require <data-source/couch-ds>
//= require <flash_comm>
//= require <util>
//= require <unit>
//= require <models/sparks-activity>
//= require <models/sparks-section>
//= require <models/sparks-page>
//= require <models/sparks-question>
//= require <models/sparks-log>
//= require <models/sparks-report>
//= require <views/sparks-activity-view>
//= require <views/sparks-section-view>
//= require <views/sparks-page-view>
//= require <views/sparks-question-view>
//= require <views/sparks-report-view>
//= require <controllers/sparks-question-controller>
//= require <controllers/sparks-page-controller>
//= require <controllers/sparks-log-controller>
//= require <controllers/sparks-section-controller>
//= require <controllers/sparks-activity-controller>
//= require <controllers/sparks-report-controller>
//= require <activity-constructor>
//= require <math-parser>
//= require <string>
//= require <ui>
//= require <flash_comm>
//= require <circuit/breadboard>
//= require <circuit/multimeter2>
//= require <circuit/resistor-4band>
//= require <circuit/resistor-5band>
//= require <circuit/circuit-math>
//= require <apMessageBox>
//= require <math>

/* FILE init.js */

/*globals console sparks $ document window onDocumentReady*/

(function () {
  
  sparks.config.flash_id = 'breadboardActivity1';
  sparks.activity_base_url = "http://couchdb.cosmos.concord.org/sparks/_design/app/_show/activity/";
  sparks.activity_images_base_url = "http://couchdb.cosmos.concord.org/sparks/";
  sparks.tutorial_base_url = "http://sparks.portal.concord.org/sparks-content/tutorials/";
  
  $(document).ready(function () {
      onDocumentReady();
  });
  
  this.onDocumentReady = function () {
    // first set student data if necessary, then load activity
    var learner_id = sparks.util.readCookie('learner_id');
       
    if (learner_id) {
       console.log("setting user "+learner_id)
       var user = {"learner_id": activity.learner_id, "name": sparks.util.readCookie('student_name'),
         "student_id": sparks.util.readCookie('student_id'), "class_id": sparks.util.readCookie('class_id')};
       sparks.couchDS.setUser(user);
       
       // if there's a logged-in user, we want to stop them before they leave
       function askConfirm(){
         return "Are you sure you want to leave this page?";
       }
       window.onbeforeunload = askConfirm;
    }
    
    var activityName = window.location.hash;
    activityName = activityName.substring(1,activityName.length);
    if (!activityName){
      activityName = "series-interpretive";
    }
    
    console.log("loading "+activityName);
    sparks.couchDS.loadActivity(activityName, function(activity) {
      console.log(activity);
      var ac = new sparks.ActivityConstructor(activity);
    });
    
    // Called by flash model when it is fully loaded
    this.initActivity = function () {
        sparks.flash.init();
    };

  };
})();
 