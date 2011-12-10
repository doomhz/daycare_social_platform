(function() {
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  };
  Kin.DayCare.ProfileWallView = (function() {
    __extends(ProfileWallView, Backbone.View);
    function ProfileWallView() {
      ProfileWallView.__super__.constructor.apply(this, arguments);
    }
    ProfileWallView.prototype.model = null;
    ProfileWallView.prototype.collection = null;
    ProfileWallView.prototype.initialize = function() {
      _.bindAll(this, "addWallComment");
      return this.collection.bind("add", this.addWallComment);
    };
    ProfileWallView.prototype.addWallComment = function(model) {
      var that, wallComment;
      that = this;
      wallComment = new Kin.DayCare.WallCommentView({
        model: model
      });
      if (model.get("type") === "followup") {
        $(this.el).find("[data-id='" + (model.get("to_id")) + "'] ul.followups:first").append(wallComment.el);
      } else {
        $(this.el).prepend(wallComment.el);
      }
      return wallComment.render();
    };
    ProfileWallView.prototype.remove = function() {
      return this.collection.stopAutoUpdateComments();
    };
    return ProfileWallView;
  })();
}).call(this);
