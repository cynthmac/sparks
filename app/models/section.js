/*global sparks $ */

(function() {
  sparks.Section = function(){
    // sparks.activity = this;

    this.title = "";
    this.id = null;

    this.image = null;
    this.circuit = null;
    this.meter = new sparks.Meter();
    this.pages = [];
    this.variables = {};

    this.hide_circuit = false;
    this.show_multimeter = false;
    this.show_oscilloscope = false;
    this.allow_move_yellow_probe = false;
    this.hide_pink_probe = false;
    this.showComponentDrawer = false;

    this.section_url = "";
    this.images_url = "";

    this.visited = false;

    this.nextSection = null;

    this.view = null;
  };

  sparks.Section.prototype = {

    // The generic meter methods setProbeLocation and update can be called
    // directly through section.meter, and will be routed to any visible meters.
    // Any non-generic functions or properties should be set directly with
    // section.meter.dmm or section.meter.oscope
    meter: null,

    toJSON: function () {
      var json = {};
      json.pages = [];
      $.each(this.pages, function(i, page){
        json.pages.push(page.toJSON());
      });
      return json;
    },

    toString: function () {
      return "Section "+this.getIndex();
    },

    getIndex: function() {
      var self = this;
      var index = -1;
      $.each(sparks.activity.sections, function(i, section){
        if (section === self){
          index = i;
        }
      });
      return index;
    }

  };

  sparks.Meter = function() {};

  sparks.Meter.prototype = {
    dmm: null,
    oscope: null,

    setProbeLocation: function (probe, loc) {
      if (this.oscope) {
        this.oscope.setProbeLocation(probe, loc);
      }
      if (this.dmm) {
        this.dmm.setProbeLocation(probe, loc);
      }
    },

    // moves any and all probes from oldLoc to newLoc
    // useful for when a lead with connected probes is moved
    moveProbe: function (oldLoc, newLoc) {
      if (this.oscope) {
        this.oscope.moveProbe(oldLoc, newLoc);
      }
      if (this.dmm) {
        this.dmm.moveProbe(oldLoc, newLoc);
      }
    },

    update: function () {
      if (this.oscope) {
        this.oscope.update();
      }
      if (this.dmm) {
        this.dmm.update();
      }
    },

    reset: function() {
      if (this.oscope && this.oscope.reset) {
        this.oscope.reset();
      }
      if (this.dmm && this.dmm.reset) {
        this.dmm.reset();
      }
    }
  };

})();