(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  Kin.WallCommentsCollection = (function(_super) {

    __extends(WallCommentsCollection, _super);

    function WallCommentsCollection() {
      this.loadComments = __bind(this.loadComments, this);
      WallCommentsCollection.__super__.constructor.apply(this, arguments);
    }

    WallCommentsCollection.prototype.model = Kin.CommentModel;

    WallCommentsCollection.prototype.profileId = null;

    WallCommentsCollection.prototype.intervalId = null;

    WallCommentsCollection.prototype.loadCommentsTime = 3000;

    WallCommentsCollection.prototype.isLoadHistory = false;

    WallCommentsCollection.prototype.loadInProgress = false;

    WallCommentsCollection.prototype.uri = "/comments/:wall_id/:comment_time/:timeline";

    WallCommentsCollection.prototype.initialize = function(models, _arg) {
      this.profileId = _arg.profileId;
      return this.startAutoUpdateComments();
    };

    WallCommentsCollection.prototype.startAutoUpdateComments = function() {
      var that;
      that = this;
      return this.intervalId = window.setInterval(this.loadComments, this.loadCommentsTime);
    };

    WallCommentsCollection.prototype.stopAutoUpdateComments = function() {
      return window.clearInterval(this.intervalId);
    };

    WallCommentsCollection.prototype.loadComments = function(options) {
      var _this = this;
      if (options == null) {
        options = {
          isHistory: false
        };
      }
      if (!this.loadInProgress) {
        this.loadInProgress = true;
        this.isLoadHistory = options.isHistory;
        this.fetch({
          add: true,
          success: options.success,
          complete: function() {
            return _this.loadInProgress = false;
          }
        });
        return this.isLoadHistory = false;
      }
    };

    WallCommentsCollection.prototype.add = function(models, options) {
      models = _.isArray(models) ? models.slice() : [models];
      models = _.difference(models, this.models);
      return WallCommentsCollection.__super__.add.call(this, models, options);
    };

    WallCommentsCollection.prototype.getMaxCommentTime = function() {
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

    WallCommentsCollection.prototype.getMinCommentTime = function() {
      var comment, createdAt, firstCommentTime, _i, _len, _ref;
      firstCommentTime = new Date().getTime();
      _ref = this.models;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        comment = _ref[_i];
        createdAt = comment.get("added_at");
        if (createdAt < firstCommentTime) firstCommentTime = createdAt;
      }
      return firstCommentTime;
    };

    WallCommentsCollection.prototype.url = function() {
      if (!this.isLoadHistory) {
        return this.uri.replace(":wall_id", this.profileId).replace(":comment_time", this.getMaxCommentTime()).replace(":timeline", "future");
      } else {
        return this.historyUrl();
      }
    };

    WallCommentsCollection.prototype.historyUrl = function() {
      return this.uri.replace(":wall_id", this.profileId).replace(":comment_time", this.getMinCommentTime()).replace(":timeline", "past");
    };

    return WallCommentsCollection;

  })(Backbone.Collection);

}).call(this);
