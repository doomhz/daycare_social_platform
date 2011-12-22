(function() {
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
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
      WallCommentsCollection.__super__.constructor.apply(this, arguments);
    }
    WallCommentsCollection.prototype.model = Kin.CommentModel;
    WallCommentsCollection.prototype.dayCareId = null;
    WallCommentsCollection.prototype.socket = null;
    WallCommentsCollection.prototype.socketUrl = "http://" + window.location.hostname + "/day-cares-wall-comments";
    WallCommentsCollection.prototype.initialize = function(models, _arg) {
      this.dayCareId = _arg.dayCareId;
      return this.startAutoUpdateComments();
    };
    WallCommentsCollection.prototype.startAutoUpdateComments = function() {
      var that;
      that = this;
      this.socket = window.io.connect(this.socketUrl);
      this.socket.on("new-wall-comments", function(data) {
        if (data.wall_id) {
          if (data.wall_id === that.dayCareId) {
            return that.add(data.comments);
          }
        } else {
          return that.addAll(data.comments);
        }
      });
      return this.socket.emit("get-new-comments", {
        wall_id: that.dayCareId
      });
    };
    WallCommentsCollection.prototype.stopAutoUpdateComments = function() {};
    WallCommentsCollection.prototype.addAll = function(comments) {
      var loaderModel, that;
      that = this;
      loaderModel = new Kin.DayCare.WallCommentView();
      return loaderModel.deferOnTemplateLoad(function() {
        var comment, _i, _len, _results;
        _results = [];
        for (_i = 0, _len = comments.length; _i < _len; _i++) {
          comment = comments[_i];
          _results.push(that.add(comment));
        }
        return _results;
      });
    };
    return WallCommentsCollection;
  })();
}).call(this);
