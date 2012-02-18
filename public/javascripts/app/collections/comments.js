(function() {
  var __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  Kin.CommentsCollection = (function(_super) {

    __extends(CommentsCollection, _super);

    function CommentsCollection() {
      CommentsCollection.__super__.constructor.apply(this, arguments);
    }

    CommentsCollection.prototype.model = Kin.CommentModel;

    CommentsCollection.prototype.uri = "/comments/:comment_id";

    CommentsCollection.prototype.commentId = null;

    CommentsCollection.prototype.initialize = function(models, options) {
      if (options == null) options = {};
      return this.commentId = options.commentId;
    };

    CommentsCollection.prototype.url = function() {
      return "" + (this.uri.replace(":comment_id", this.commentId));
    };

    return CommentsCollection;

  })(Backbone.Collection);

}).call(this);
