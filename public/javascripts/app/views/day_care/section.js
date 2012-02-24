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
      return ["CPR Certified", "First Aid Certified", "FIA Accepted", "Latchkey", "Educational Programs", "National Accreditation (NAFCC)", "Smoke-Free Environment", "Special Needs Children Accepted", "Do You Have Webcams available in your classes"];
    };

    SectionView.prototype.getIndoors = function() {
      return ["Clean restrooms and food preparation areas (with separate sinks)", "Adequate heating and ventilation", "Children are supervised at all times, even when they are sleeping", "Screened heating vents/heaters", "Inaccessible electrical outlets, stoves, and pilot lights", "Fire extinguishers and smoke detectors", "Adequate fire exits (at least two)", "Sharp edges are padded", "Cabinets have 'child proof' guards", "Adequate first-aid kit (indoors and out)", "Place for children's clothes and belongings", "Quiet nap area", "Dramatic play area (dress-up clothes, toy stove and sink, strollers)", "Low tables and chairs", "Musical toys", "Stuffed animals and dolls", "Record/cassette player (records/cassettes)", "Blocks and block accessories", "Age-appropriate manipulative toys (puzzles, etc.)", "Art supplies, clay, play dough", "Children's artwork displayed", "Age-appropriate books"];
    };

    SectionView.prototype.getOutdoors = function() {
      return ["Playground surrounded by a fence", "playground equipment is safe, with no sharp edges, and kept in good shape", "the soil and playground surfaces are often checked for dangerous substances and hazards", "Yard free of debris", "Drinking water available", "Sand or digging area", "Water play supplies", "Sturdy climbing equipment (with cushioning material beneath)", "Tricycles and other mobility toys", "Easels and paint", "Grass, shade trees, garden area"];
    };

    SectionView.prototype.getForInfants = function() {
      return ["Toys that are a safe size (non-swallowable) and that can be easily sanitized", "Colorful mobiles and pictures", "Outdoor area with safe crawling space", "Equipment that infants can crawl over and through", "Wheel toys that are safe for toddlers to ride on, push, and be given rides in", "Sanitary diaper changing area accessible to running water", "Toilet-training procedures communicated to parents", "Daily observation charts recording feeding, napping, and diapering/toileting", "All child care staff, volunteers, and substitutes have been trained on and implementing infant back sleeping and safe sleep policies to reduce the risk of SIDS (Sudden Infant Death Syndrome)", "Caregivers always keep a hand on the child while diapering", "Caregivers clean and sanitize the surface after finishing the changing process of diapering"];
    };

    SectionView.prototype.getHealthAndSafetyIssues = function() {
      return ["Children are supervised at all times, even when they are sleeping", "The child care program have records proving that the other children in care are up-to-date on all their required immunizations", "The child care program have an emergency plan if a child is injured, sick, or lost", "All caregivers been trained how to prevent child abuse, how to recognize signs of child abuse, and  how to report suspected child abuse", "The caregivers were trained and the medications  are labeled to make sure the right child gets the right amount of the right medication at the right time", "The child care program has a first aid kit", "The staff have training in infant and child first aid, CPR, and infectious diseases", "The staff has been trained to understand and meet the needs of children of different ages", "All caregivers and children wash their hands often, especially before eating and after using the bathroom or changing diapers", "A health evaluation is required for a child to enter the program", "Emergency phone numbers are clearly posted (work/home, your pediatrician, a friend or relative, fire, police)", "Procedures are established to care for a child who becomes sick or is injured", "Every child has access to and wears a seat belt when traveling in a vehicle", "Car seats are provided for children who require them", "The facility has an earthquake or emergency evacuation plan", "The provider has emergency supplies stored in case of an earthquake", "Medicines, poisons, and pointed items are kept out of children's sight and reach"];
    };

    SectionView.prototype.getTransportationPolicies = function() {
      return ["Parents bring their children to and from school.", "Private bus service available.", "Located close to public transportation."];
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
