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

    InvitesView.prototype.quickAddChildTplUrl = "/templates/main/day_care/quick_add_child.html";

    InvitesView.prototype.events = {
      "submit #send-invite-form": "sendInvite",
      "click #open-add-child-box-bt": "openAddChildBoxHandler"
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
      mothersData = this.getFormData($form, "mother");
      fathersData = this.getFormData($form, "father");
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
        name: $form.find("input[name='" + fieldPrefix + "s-name']").val(),
        surname: $form.find("input[name='" + fieldPrefix + "s-surname']").val(),
        email: $form.find("input[name='" + fieldPrefix + "s-email']").val(),
        children_ids: $form.find("select[name='children_ids']").val(),
        parent_type: fieldPrefix
      };
      if (data.name && data.surname && data.email) {
        return data;
      } else {
        return false;
      }
    };

    InvitesView.prototype.openAddChildBoxHandler = function(ev) {
      ev.preventDefault();
      return this.showQuickAddChildWindow();
    };

    InvitesView.prototype.showQuickAddChildWindow = function() {
      var that;
      that = this;
      return $.tmpload({
        url: this.quickAddChildTplUrl,
        onLoad: function(tpl) {
          var winContent;
          winContent = tpl({
            profile: that.model
          });
          return dWindow(winContent, {
            wrapperId: "quick-add-child-win",
            closeOnSideClick: false,
            buttons: {
              "add": "add",
              "cancel": "cancel"
            },
            buttonClick: function(btType, $win) {
              var $form, childModel, formData;
              if (btType === "add") {
                $form = $win.find("form:first");
                formData = $form.serialize();
                childModel = new Kin.ChildModel;
                childModel.save(null, {
                  data: formData,
                  success: function() {
                    that.render();
                    return $.jGrowl("Child added successfully");
                  },
                  error: function() {
                    return $.jGrowl("Child could not be added :( Please try again.");
                  }
                });
              }
              return $win.close();
            }
          });
        }
      });
    };

    InvitesView.prototype.remove = function() {
      this.unbind();
      return $(this.el).unbind().empty();
    };

    return InvitesView;

  })(Backbone.View);

}).call(this);
