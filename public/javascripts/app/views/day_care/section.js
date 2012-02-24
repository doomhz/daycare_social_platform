(function() {
  var __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  Kin.DayCare.SectionView = (function(_super) {

    __extends(SectionView, _super);

    function SectionView() {
      SectionView.__super__.constructor.apply(this, arguments);
    }

    SectionView.prototype.el = null;

    SectionView.prototype.tplUrl = '/templates/main/day_care/{sectionName}.html';

    SectionView.prototype.model = null;

    SectionView.prototype.events = {
      "submit #edit-section-form": "submitSectionFormHandler"
    };

    SectionView.prototype.initialize = function(options) {};

    SectionView.prototype.getGeneralAproachesToLearning = function() {
      return ["Play-Based", "Co-op", "Montessori"];
    };

    SectionView.prototype.getLearningPhilosophyAndToolsLanguage = function() {
      return ["Oral language", "Nursery rhymes", "poems", "songs", "Storybook", "reading", "Emerging", "literacy skills"];
    };

    SectionView.prototype.getLearningPhilosophyAndToolsCognitiveDev = function() {
      return ["Math & number sense", "Time & space", "Sci. reasoning/physical world", "Music", "Visual arts", "Physical activity", "Other subjects taught (specify)"];
    };

    SectionView.prototype.getHomeSchoolConnections = function() {
      return ["Notes", "Phone Calls", "Voice Mail", "Email", "Special Meetings", "Two or More Regular Conferences", "Drop-Off", "Pick-Up", "Regular newsletter/printed updates circulated to the whole school"];
    };

    SectionView.prototype.getHomeSchoolSeparations = function() {
      return ["Pre-entry meetings with parents at school", "Extra staff dedicated to handle separation", "Small group sessions", "Parents in classroom early on", "Abbreviated schedule at start of school year"];
    };

    SectionView.prototype.getCertificates = function() {
      return ["CPR Certified?", "First Aid Certified?", "FIA Accepted?", "Latchkey?", "Educational Programs?", "National Accreditation (NAFCC)?", "Smoke-Free Environment?", "Special Needs Children Accepted?", "Do You Have Webcams available in your classes?"];
    };

    SectionView.prototype.render = function() {
      var that, tplUrl;
      that = this;
      tplUrl = this.tplUrl.replace("{sectionName}", this.model.get("name")).replace(/-/g, "_");
      return $.tmpload({
        url: tplUrl,
        onLoad: function(tpl) {
          return that.model.fetch({
            success: function(model) {
              $(that.el).html(tpl({
                section: model,
                view: that
              }));
              return that.$(".chzn-select").chosen();
            }
          });
        }
      });
    };

    SectionView.prototype.submitSectionFormHandler = function(ev) {
      var $form, formData;
      ev.preventDefault();
      $form = $(ev.target);
      formData = $form.serialize();
      return this.model.save(null, {
        data: formData,
        success: function() {
          return $.jGrowl("Data was successfully saved.");
        },
        error: function() {
          return $.jGrowl("Data could not be saved :( Please try again.");
        }
      });
    };

    SectionView.prototype.remove = function() {
      this.unbind();
      return $(this.el).unbind().empty();
    };

    return SectionView;

  })(Backbone.View);

}).call(this);
