(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  Kin.FollowupsCollection = (function(_super) {

    __extends(FollowupsCollection, _super);

    function FollowupsCollection() {
      this.loadFollowups = __bind(this.loadFollowups, this);
      FollowupsCollection.__super__.constructor.apply(this, arguments);
    }

    FollowupsCollection.prototype.model = Kin.CommentModel;

    FollowupsCollection.prototype.uri = "/followups/:comment_id/:comment_time";

    FollowupsCollection.prototype.commentId = null;

    FollowupsCollection.prototype.loadCommentsTime = 3000;

    FollowupsCollection.prototype.intervalId = null;

    FollowupsCollection.prototype.initialize = function(models, options) {
      if (options == null) options = {};
      window.fl = this;
      return this.commentId = options.commentId;
    };

    FollowupsCollection.prototype.startAutoUpdateFollowups = function() {
      return this.intervalId = window.setInterval(this.loadFollowups, this.loadCommentsTime);
    };

    FollowupsCollection.prototype.loadFollowups = function() {
      return this.fetch({
        add: true
      });
    };

    FollowupsCollection.prototype.getMaxCommentTime = function() {
      var comment, createdAt, lastCommentTime, _i, _len, _ref;
      lastCommentTime = 0;
      if (this.length) {
        _ref = this.models;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          comment = _ref[_i];
          createdAt = comment.get("added_at");
          if (createdAt > lastCommentTime) lastCommentTime = createdAt;
        }
      }
      return lastCommentTime;
    };

    FollowupsCollection.prototype.url = function() {
      return "" + (this.uri.replace(":comment_id", this.commentId).replace(":comment_time", this.getMaxCommentTime()));
    };

    return FollowupsCollection;

  })(Backbone.Collection);

}).call(this);
