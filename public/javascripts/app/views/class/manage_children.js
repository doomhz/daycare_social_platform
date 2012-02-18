(function() {
  var __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  Kin.Class.ManageChildrenView = (function(_super) {

    __extends(ManageChildrenView, _super);

    function ManageChildrenView() {
      ManageChildrenView.__super__.constructor.apply(this, arguments);
    }

    ManageChildrenView.prototype.el = null;

    ManageChildrenView.prototype.tplUrl = '/templates/main/class/manage_children.html';

    ManageChildrenView.prototype.events = {
      "submit #add-child-form": "addChild"
    };

    ManageChildrenView.prototype.initialize = function() {
      return ManageChildrenView.__super__.initialize.call(this);
    };

    ManageChildrenView.prototype.render = function() {
      var that;
      that = this;
      return $.tmpload({
        url: this.tplUrl,
        onLoad: function(tpl) {
          $(that.el).html(tpl({
            profile: that.model
          }));
          that.childrenList = new Kin.Class.ChildrenListView({
            el: that.$("#children-list"),
            collection: that.collection,
            model: that.model
          });
          return that.childrenList.render();
        }
      });
    };

    ManageChildrenView.prototype.addChild = function(ev) {
      var childModel, hashedData, that;
      ev.preventDefault();
      that = this;
      hashedData = this.$(ev.target).hashForm();
      if (hashedData.birthday) {
        hashedData.birthday = "" + hashedData.birthday.year + "-" + hashedData.birthday.month + "-" + hashedData.birthday.day;
      }
      childModel = new Kin.ChildModel;
      return childModel.save(hashedData, {
        success: function() {
          var childName, childSurname;
          childName = hashedData.name;
          childSurname = hashedData.surname;
          $.jGrowl("" + childName + " " + childSurname + " successfully added to this group");
          return that.render();
        },
        error: function() {
          return $.jGrowl("There was an error adding the child :( Please try again.");
        }
      });
    };

    ManageChildrenView.prototype.remove = function() {
      this.unbind();
      return $(this.el).unbind().empty();
    };

    return ManageChildrenView;

  })(Backbone.View);

}).call(this);
