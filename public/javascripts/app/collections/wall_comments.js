(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; }, __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  };
  Kin.WallCommentsCollection = (function() {
    __extends(WallCommentsCollection, Backbone.Collection);
    function WallCommentsCollection() {
      this.loadComments = __bind(this.loadComments, this);
      WallCommentsCollection.__super__.constructor.apply(this, arguments);
    }
    WallCommentsCollection.prototype.model = Kin.CommentModel;
    WallCommentsCollection.prototype.dayCareId = null;
    WallCommentsCollection.prototype.intervalId = null;
    WallCommentsCollection.prototype.loadCommentsTime = 3000;
    WallCommentsCollection.prototype.lastQueryTime = 0;
    WallCommentsCollection.prototype.uri = "/comments/:wall_id/:last_query_time";
    WallCommentsCollection.prototype.initialize = function(models, _arg) {
      this.dayCareId = _arg.dayCareId;
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
    WallCommentsCollection.prototype.loadComments = function() {
      return this.fetch({
        add: true,
        success: __bind(function(comments) {
          var createdAt;
          createdAt = new Date(comments.last().get("created_at")).getTime();
          return this.lastQueryTime = createdAt;
        }, this)
      });
    };
    WallCommentsCollection.prototype.url = function() {
      return this.uri.replace(":wall_id", this.dayCareId).replace(":last_query_time", this.lastQueryTime);
    };
    return WallCommentsCollection;
  })();
}).call(this);
