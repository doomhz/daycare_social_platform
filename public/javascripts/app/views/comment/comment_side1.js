(function() {
  var __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  window.Kin.Comment.CommentSide1View = (function(_super) {

    __extends(CommentSide1View, _super);

    function CommentSide1View() {
      CommentSide1View.__super__.constructor.apply(this, arguments);
    }

    CommentSide1View.prototype.el = null;

    CommentSide1View.prototype.tplUrl = '/templates/side1/comment/comment.html';

    CommentSide1View.prototype.model = null;

    CommentSide1View.prototype.initialize = function() {};

    CommentSide1View.prototype.render = function() {
      var that;
      that = this;
      return $.tmpload({
        url: this.tplUrl,
        onLoad: function(tpl) {
          return $(that.el).html(tpl({
            comment: that.model
          }));
        }
      });
    };

    CommentSide1View.prototype.remove = function() {
      this.unbind();
      $(this.el).unbind().empty();
      return this;
    };

    return CommentSide1View;

  })(Backbone.View);

}).call(this);
