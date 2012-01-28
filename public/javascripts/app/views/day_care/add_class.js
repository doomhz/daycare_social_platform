(function() {
  var __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  Kin.DayCare.AddClassView = (function(_super) {

    __extends(AddClassView, _super);

    function AddClassView() {
      AddClassView.__super__.constructor.apply(this, arguments);
    }

    AddClassView.prototype.el = null;

    AddClassView.prototype.tplUrl = '/templates/main/day_care/add_class.html';

    AddClassView.prototype.events = {
      "submit #add-class-form": "addClass"
    };

    AddClassView.prototype.currentUser = null;

    AddClassView.prototype.initialize = function(_arg) {
      this.currentUser = _arg.currentUser;
      return AddClassView.__super__.initialize.call(this);
    };

    AddClassView.prototype.render = function() {
      var that;
      that = this;
      return $.tmpload({
        url: this.tplUrl,
        onLoad: function(tpl) {
          var profile;
          profile = new Kin.ProfileModel();
          return $(that.el).html(tpl({
            profile: profile
          }));
        }
      });
    };

    AddClassView.prototype.addClass = function(ev) {
      var $form, formData, profileModel, that;
      ev.preventDefault();
      that = this;
      $form = $(ev.target);
      formData = $form.serialize();
      profileModel = new Kin.ProfileModel();
      return profileModel.save(null, {
        data: formData,
        success: function(model, response) {
          var name;
          name = $form.find("input[name='name']").val();
          $.jGrowl("" + name + " class was successfully created");
          that.currentUser.fetch();
          return that.router.navigate("manage-children/" + response._id, true);
        },
        error: function() {
          return $.jGrowl("The class could not be created :( Please try again.");
        }
      });
    };

    AddClassView.prototype.remove = function() {
      this.unbind();
      return $(this.el).unbind().empty();
    };

    return AddClassView;

  })(Backbone.View);

}).call(this);
