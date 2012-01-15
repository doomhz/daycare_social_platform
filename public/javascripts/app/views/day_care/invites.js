(function() {
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  };
  Kin.DayCare.InvitesView = (function() {
    __extends(InvitesView, Backbone.View);
    function InvitesView() {
      InvitesView.__super__.constructor.apply(this, arguments);
    }
    InvitesView.prototype.el = null;
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
          $(that.el).html(tpl());
          that.friendRequestsList = new Kin.Profile.FriendRequestsListView({
            el: that.$("#friend-requests-list"),
            collection: that.collection
          });
          return that.renderFriendRequestsList();
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
      var $form, formData, friendRequestModel, that;
      ev.preventDefault();
      that = this;
      $form = $(ev.target);
      formData = $form.serialize();
      friendRequestModel = new Kin.FriendRequestModel;
      return friendRequestModel.save(null, {
        data: formData,
        success: function() {
          var parentName, parentSurname;
          parentName = $form.find("input[name='name']").val();
          parentSurname = $form.find("input[name='surname']").val();
          $form.find("input[type='text']").val("");
          $.jGrowl("Invite successfully sent to " + parentName + " " + parentSurname);
          return that.renderFriendRequestsList();
        },
        error: function() {
          return $.jGrowl("Invite could not be sent :( Please try again.");
        }
      });
    };
    InvitesView.prototype.remove = function() {
      this.unbind();
      return $(this.el).unbind().empty();
    };
    return InvitesView;
  })();
}).call(this);
