(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  Kin.Profile.WallCommentView = (function(_super) {

    __extends(WallCommentView, _super);

    function WallCommentView() {
      this.deleteCommentHandler = __bind(this.deleteCommentHandler, this);
      this.editCommentHandler = __bind(this.editCommentHandler, this);
      WallCommentView.__super__.constructor.apply(this, arguments);
    }

    WallCommentView.prototype.tagName = 'li';

    WallCommentView.prototype.tplUrl = '/templates/main/profile/wall_comment.html';

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
            that.$('a[rel^="prettyPhoto"]').prettyPhoto({
              slideshow: false,
              social_tools: false,
              theme: 'light_rounded',
              deeplinking: false,
              animation_speed: 0
            });
          }
          if (typeof that.model.get("content") !== "object") {
            that.$(".comment-text").expander({
              slicePoint: 215,
              expandSpeed: 0,
              collapseSpeed: 0
            });
          }
          that.$(".edit-comment").bind("click", that.editCommentHandler);
          return that.$(".delete-comment").bind("click", that.deleteCommentHandler);
        }
      });
    };

    WallCommentView.prototype.editCommentHandler = function(ev) {
      var that;
      ev.preventDefault();
      that = this;
      if (typeof this.model.get("content") === "string") {
        return this.$(".comment-text:first").doomEdit({
          autoTrigger: true,
          ajaxSubmit: false,
          submitOnBlur: true,
          submitBtn: false,
          cancelBtn: false,
          editField: '<textarea name="content" class="comment-edit-textarea"></textarea>',
          showOnEvent: false,
          afterFormSubmit: function(data, form, $el) {
            $el.text(data);
            return that.model.save({
              content: data
            }, {
              silent: true
            });
          }
        });
      }
    };

    WallCommentView.prototype.deleteCommentHandler = function(ev) {
      var that;
      ev.preventDefault();
      that = this;
      return dConfirm("Are you sure you want to remove the comment?", function(btType, win) {
        if (btType === "yes") {
          win.close();
          that.model.destroy();
          $(that.el).remove();
        }
        if (btType === "no" || btType === "close") return win.close();
      });
    };

    return WallCommentView;

  })(Backbone.View);

}).call(this);
