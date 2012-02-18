(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  window.Kin.Comment.CommentView = (function(_super) {

    __extends(CommentView, _super);

    function CommentView() {
      this.addWallComment = __bind(this.addWallComment, this);
      CommentView.__super__.constructor.apply(this, arguments);
    }

    CommentView.prototype.el = null;

    CommentView.prototype.collection = null;

    CommentView.prototype.followupsCollection = null;

    CommentView.prototype.model = null;

    CommentView.prototype.tplUrl = "/templates/main/comment/comment.html";

    CommentView.prototype.events = {
      "submit .add-followup-form": "addFollowupHandler",
      "keyup .add-followup-form textarea": "typeFollowupHandler"
    };

    CommentView.prototype.initialize = function(options) {
      if (options == null) options = {};
      this.followupsCollection = options.followupsCollection;
      this.collection.bind("add", this.addWallComment);
      return this.followupsCollection.bind("add", this.addWallComment);
    };

    CommentView.prototype.render = function() {
      var that;
      that = this;
      return $.tmpload({
        url: this.tplUrl,
        onLoad: function(tpl) {
          $(that.el).html(tpl());
          return that.collection.fetch({
            add: true,
            success: function() {
              that.followupsCollection.loadFollowups();
              return that.followupsCollection.startAutoUpdateFollowups();
            }
          });
        }
      });
    };

    CommentView.prototype.remove = function() {
      this.unbind();
      return $(this.el).unbind().empty();
    };

    CommentView.prototype.addWallComment = function(model) {
      var that, wallComment;
      that = this;
      model.set({
        "wall_id": this.model.get("wall_id")
      });
      wallComment = new Kin.Profile.WallCommentView({
        model: model
      });
      return $.tmpload({
        url: wallComment.tplUrl,
        onLoad: function(tpl) {
          var $followupsCnt;
          if (model.get("type") === "followup") {
            $followupsCnt = that.$("#wall-comments-list").find("[data-id='" + (model.get("to_id")) + "'] ul.followups:first");
            $followupsCnt.append(wallComment.el);
          } else {
            that.$("#wall-comments-list").append(wallComment.el);
          }
          return wallComment.render();
        }
      });
    };

    CommentView.prototype.addFollowupHandler = function(ev) {
      var $form;
      ev.preventDefault();
      $form = this.$(ev.target);
      this.sendCommentFromForm($form);
      return $form.find("textarea").val("").keyup();
    };

    CommentView.prototype.typeFollowupHandler = function(ev) {
      var $form;
      if (ev.keyCode === 13) {
        $form = this.$(ev.target).parents("form");
        return $form.submit();
      }
    };

    CommentView.prototype.sendCommentFromForm = function($form) {
      var comment, commentData, that;
      that = this;
      commentData = $form.serialize();
      comment = new Kin.CommentModel({
        wall_id: this.model.get("wall_id")
      });
      return comment.save(null, {
        data: commentData,
        success: function() {
          return that.followupsCollection.loadFollowups();
        }
      });
    };

    return CommentView;

  })(Backbone.View);

}).call(this);
