(function() {
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  };
  Kin.DayCare.WallCommentView = (function() {
    __extends(WallCommentView, Backbone.View);
    function WallCommentView() {
      WallCommentView.__super__.constructor.apply(this, arguments);
    }
    WallCommentView.prototype.tagName = 'li';
    WallCommentView.prototype.tplUrl = '/templates/main/day_care/wall_comment.html';
    WallCommentView.prototype.initialize = function() {
      return this.model && (this.model.view = this);
    };
    WallCommentView.prototype.render = function() {
      var that;
      that = this;
      return $.tmpload({
        url: this.tplUrl,
        onLoad: function(tpl) {
          $(that.el).addClass(that.model.get("type")).attr("data-id", that.model.get("_id")).html(tpl({
            comment: that.model
          }));
          that.$(".time").timeago();
          if (that.model.get("type") === "status") {
            that.$(".add-followup-form:first textarea").autoResize({
              extraSpace: -2
            });
            return that.$('a[rel^="prettyPhoto"]').prettyPhoto({
              slideshow: false,
              social_tools: false,
              theme: 'light_rounded',
              deeplinking: false,
              animation_speed: 0
            });
          }
        }
      });
    };
    return WallCommentView;
  })();
}).call(this);
