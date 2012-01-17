(function() {
  var __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  Kin.Profile.FriendRequestsListView = (function(_super) {

    __extends(FriendRequestsListView, _super);

    function FriendRequestsListView() {
      FriendRequestsListView.__super__.constructor.apply(this, arguments);
    }

    FriendRequestsListView.prototype.collection = null;

    FriendRequestsListView.prototype.tplUrl = '/templates/main/profile/friend_requests_list.html';

    FriendRequestsListView.prototype.initialize = function() {};

    FriendRequestsListView.prototype.render = function() {
      var that;
      that = this;
      return $.tmpload({
        url: this.tplUrl,
        onLoad: function(tpl) {
          var $el;
          $el = $(that.el);
          return $el.html(tpl({
            friendRequests: that.collection
          }));
        }
      });
    };

    return FriendRequestsListView;

  })(Backbone.View);

}).call(this);
