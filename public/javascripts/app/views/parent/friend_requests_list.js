(function() {
  var __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  Kin.Parent.FriendRequestsListView = (function(_super) {

    __extends(FriendRequestsListView, _super);

    function FriendRequestsListView() {
      FriendRequestsListView.__super__.constructor.apply(this, arguments);
    }

    FriendRequestsListView.prototype.collection = null;

    FriendRequestsListView.prototype.model = null;

    FriendRequestsListView.prototype.tplUrl = '/templates/main/parent/friend_requests_list.html';

    FriendRequestsListView.prototype.events = {
      "click .parent-name": "parentNameClickHandler",
      "submit .friend-request-class-form": "editClassesSubmitHandler"
    };

    FriendRequestsListView.prototype.initialize = function() {};

    FriendRequestsListView.prototype.render = function() {
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
              var $el;
              $el = $(that.el);
              $el.html(tpl({
                friendRequests: that.collection,
                profile: that.model,
                classes: that.model.get("daycare_friends"),
                children: children.models
              }));
              return that.$(".chzn-select").chosen();
            }
          });
        }
      });
    };

    FriendRequestsListView.prototype.parentNameClickHandler = function(ev) {
      var $classContainer, $target, requestId;
      ev.preventDefault();
      $target = $(ev.target);
      requestId = $target.data("id");
      $classContainer = this.$("#class-cnt-" + requestId);
      return $classContainer.toggleClass("hidden");
    };

    FriendRequestsListView.prototype.closeEditClassCnt = function(requestId) {
      return this.$("#class-cnt-" + requestId).addClass("hidden");
    };

    FriendRequestsListView.prototype.editClassesSubmitHandler = function(ev) {
      var $target, data, friendRequest, friendRequestId, that;
      ev.preventDefault();
      that = this;
      $target = $(ev.target);
      data = $target.serialize();
      friendRequestId = $target.data("id");
      friendRequest = new Kin.FriendRequestModel({
        _id: friendRequestId
      });
      return friendRequest.save(null, {
        data: data,
        success: function() {
          $.jGrowl("Classes successfully changed");
          return that.closeEditClassCnt(friendRequestId);
        },
        error: function() {
          return $.jGrowl("Classes could not be changed :( Please try again.");
        }
      });
    };

    return FriendRequestsListView;

  })(Backbone.View);

}).call(this);
