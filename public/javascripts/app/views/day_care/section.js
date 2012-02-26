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

    SectionView.prototype.tagInputsTplUrl = '/templates/main/day_care/tag_inputs.html';

    SectionView.prototype.tagListTplUrl = '/templates/main/day_care/tag_list.html';

    SectionView.prototype.model = null;

    SectionView.prototype.events = {
      "submit #edit-section-form": "submitSectionFormHandler"
    };

    SectionView.prototype.initialize = function(options) {};

    SectionView.prototype.getTags = function(type, callback) {
      var tags;
      tags = new Kin.TagsCollection([], {
        type: type
      });
      return tags.fetch({
        success: function(collection) {
          return callback(collection.models);
        }
      });
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

    SectionView.prototype.renderTagInputs = function(type, tags, selectedTags) {
      var that, tpl;
      that = this;
      return tpl = $.tmpload({
        url: this.tagInputsTplUrl,
        onLoad: function(tpl) {
          return that.$("#" + type + "-inputs").html(tpl({
            tags: tags,
            selectedTags: selectedTags
          }));
        }
      });
    };

    SectionView.prototype.renderTagList = function(type, tags, selectedTags) {
      var that, tpl;
      that = this;
      return tpl = $.tmpload({
        url: this.tagListTplUrl,
        onLoad: function(tpl) {
          return that.$("#" + type + "-list").html(tpl({
            tags: tags,
            selectedTags: selectedTags
          }));
        }
      });
    };

    SectionView.prototype.displayTagInputs = function(type) {
      var selectedTags, that;
      that = this;
      selectedTags = this.model.get(type);
      return this.getTags(type, function(tags) {
        return that.renderTagInputs(type, tags, selectedTags);
      });
    };

    SectionView.prototype.displayTagList = function(type) {
      var selectedTags, that;
      that = this;
      selectedTags = this.model.get(type);
      return this.getTags(type, function(tags) {
        return that.renderTagList(type, tags, selectedTags);
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
