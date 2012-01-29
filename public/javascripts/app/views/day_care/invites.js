(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  Kin.DayCare.InvitesView = (function(_super) {

    __extends(InvitesView, _super);

    function InvitesView() {
      this.onFormSaveError = __bind(this.onFormSaveError, this);
      this.onFormSaveSuccess = __bind(this.onFormSaveSuccess, this);
      InvitesView.__super__.constructor.apply(this, arguments);
    }

    InvitesView.prototype.el = null;

    InvitesView.prototype.model = null;

    InvitesView.prototype.tplUrl = '/templates/main/day_care/invites.html';

    InvitesView.prototype.events = {
      "submit #send-invite-form": "sendInvite"
    };

    InvitesView.prototype.initialize = function() {};

    InvitesView.prototype.render = function() {
      var that;
      that = this;
      return $.tmpload({
        url: this.tplUrl,
        onLoad: function(tpl) {
          var children;
          children = new Kin.ChildrenCollection([], {
            userId: that.model.get("_id")
          });
          return children.fetch({
            success: function() {
              $(that.el).html(tpl({
                profile: that.model,
                classes: that.model.get("daycare_friends"),
                children: children.models
              }));
              that.$(".chzn-select").chosen();
              that.friendRequestsList = new Kin.DayCare.FriendRequestsListView({
                el: that.$("#friend-requests-list"),
                collection: that.collection,
                model: that.model
              });
              return that.renderFriendRequestsList();
            }
          });
        }
      });
    };

    InvitesView.prototype.renderFriendRequestsList = function() {
      var that;
      that = this;
      return that.friendRequestsList.collection.fetch({
        success: function() {
          return that.friendRequestsList.render();
        }
      });
    };

    InvitesView.prototype.sendInvite = function(ev) {
      var $form, fathersData, mothersData, that;
      ev.preventDefault();
      that = this;
      $form = $(ev.target);
      mothersData = this.getFormData($form, "mothers");
      fathersData = this.getFormData($form, "fathers");
      if (mothersData) this.saveFriendRequest(mothersData);
      if (fathersData) return this.saveFriendRequest(fathersData);
    };

    InvitesView.prototype.saveFriendRequest = function(data) {
      var friendRequestModel;
      friendRequestModel = new Kin.FriendRequestModel(data);
      return friendRequestModel.save(null, {
        success: this.onFormSaveSuccess,
        error: this.onFormSaveError
      });
    };

    InvitesView.prototype.onFormSaveSuccess = function() {
      $.jGrowl("Invite successfully sent");
      return this.render();
    };

    InvitesView.prototype.onFormSaveError = function() {
      return $.jGrowl("Invite could not be sent :( Please try again.");
    };

    InvitesView.prototype.getFormData = function($form, fieldPrefix) {
      var data;
      data = {
        name: $form.find("input[name='" + fieldPrefix + "-name']").val(),
        surname: $form.find("input[name='" + fieldPrefix + "-surname']").val(),
        email: $form.find("input[name='" + fieldPrefix + "-email']").val(),
        children_ids: $form.find("select[name='children_ids']").val()
      };
      if (data.name && data.surname && data.email) {
        return data;
      } else {
        return false;
      }
    };

    InvitesView.prototype.remove = function() {
      this.unbind();
      return $(this.el).unbind().empty();
    };

    return InvitesView;

  })(Backbone.View);

}).call(this);
