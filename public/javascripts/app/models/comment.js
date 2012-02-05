(function() {
  var __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  Kin.CommentModel = (function(_super) {

    __extends(CommentModel, _super);

    function CommentModel() {
      CommentModel.__super__.constructor.apply(this, arguments);
    }

    CommentModel.prototype.defaults = {
      from_id: null,
      to_id: null,
      wall_id: null,
      type: "status",
      content: null,
      created_at: null,
      updated_at: null,
      from_user: {}
    };

    CommentModel.prototype.urlRoot = "/comments";

    CommentModel.prototype.initialize = function() {
      if (this.collection) {
        return this.set({
          wall_id: this.collection.profileId
        });
      }
    };

    CommentModel.prototype.url = function() {
      var id;
      id = this.id || "";
      return "" + this.urlRoot + "/" + id;
    };

    return CommentModel;

  })(Backbone.Model);

}).call(this);
