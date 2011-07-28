//= require "setup-common"
//= require <jquery/jquery-1.4.2.min>
//= require <jquery/jquery-ui-1.8.custom.min>
//= require <jquery/plugins/jquery.url.packed>
//= require <jquery/plugins/jquery.cookie>
//= require <jquery/plugins/jquery.bgiframe.min>
//= require <jquery/plugins/jquery.flash>
//= require <jquery/plugins/jquery.couch>
//= require <data-source/couch-ds>
//= require <helpers/util>
//= require <helpers/unit>
//= require <models/activity>
//= require <models/section>
//= require <models/page>
//= require <models/question>
//= require <models/log>
//= require <models/report>
//= require <views/activity-view>
//= require <views/section-view>
//= require <views/page-view>
//= require <views/question-view>
//= require <views/report-view>
//= require <controllers/question-controller>
//= require <controllers/page-controller>
//= require <controllers/log-controller>
//= require <controllers/section-controller>
//= require <controllers/activity-controller>
//= require <controllers/report-controller>
//= require <activity-constructor>
//= require <helpers/math-parser>
//= require <helpers/string>
//= require <helpers/ui>
//= require <helpers/flash_comm>
//= require <circuit/breadboard>
//= require <circuit/multimeter2>
//= require <circuit/resistor-4band>
//= require <circuit/resistor-5band>
//= require <circuit/circuit-math>
//= require <apMessageBox>
//= require <helpers/math>

/* FILE init.js */

/*globals console sparks $ document window onDocumentReady*/

(function () {
  
  sparks.config.flash_id = 'breadboardActivity1';
  sparks.activity_base_url = "http://couchdb.cosmos.concord.org/sparks/_design/app/_show/activity/";
  sparks.activity_images_base_url = "http://couchdb.cosmos.concord.org/sparks/";
  sparks.tutorial_base_url = "http://sparks.portal.concord.org/content/tutorials/";
  
  $(document).ready(function () {
      onDocumentReady();
  });
  
  this.onDocumentReady = function () {
    // first set student data if necessary, then load activity
    var learner_id = sparks.util.readCookie('learner_id');
       
    if (learner_id) {
       console.log("setting user "+learner_id)
       var user = {"learner_id": learner_id, "name": sparks.util.readCookie('student_name'),
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
 