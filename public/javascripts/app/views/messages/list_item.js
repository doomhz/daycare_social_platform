(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; }, __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  };
  window.Kin.Messages.ListItemView = (function() {
    __extends(ListItemView, Backbone.View);
    function ListItemView() {
      this.sendReply = __bind(this.sendReply, this);
      ListItemView.__super__.constructor.apply(this, arguments);
    }
    ListItemView.prototype.tagName = 'li';
    ListItemView.prototype.tplUrl = '/templates/main/messages/list_item.html';
    ListItemView.prototype.events = {
      "click .message-header-cnt": "toggleMessageBody",
      "click .delete-message-bt": "deleteMessage"
    };
    ListItemView.prototype.initialize = function() {
      return this.model && (this.model.view = this);
    };
    ListItemView.prototype.render = function() {
      var that;
      that = this;
      return $.tmpload({
        url: this.tplUrl,
        onLoad: function(tpl) {
          $(that.el).html(tpl({
            message: that.model
          }));
          that.$(".time").timeago();
          if (that.model.get("unread")) {
            $(that.el).addClass("unread");
          }
          if (that.model.get("type") === "default") {
            that.$(".add-reply-message-form:first textarea").autoResize({
              extraSpace: -2
            });
            return that.$(".add-reply-message-form:first").bind("submit", that.sendReply);
          }
        }
      });
    };
    ListItemView.prototype.toggleMessageBody = function() {
      var $messageBodyCnt, that;
      that = this;
      $messageBodyCnt = this.$(".message-body-cnt:first");
      $messageBodyCnt.toggleClass("hidden");
      if (this.model.get("unread")) {
        this.model.set({
          "unread": false
        });
        return this.model.save(null, {
          success: function() {
            return $(that.el).removeClass("unread");
          }
        });
      }
    };
    ListItemView.prototype.sendReply = function(ev) {
      var $form, formData, messageModel, that;
      ev.preventDefault();
      that = this;
      $form = $(ev.target);
      formData = $form.serialize();
      messageModel = new Kin.MessageModel;
      return messageModel.save(null, {
        data: formData,
        success: function() {
          var toName;
          toName = that.$("#message-to-name").text();
          $form.find("textarea:first").val("").keyup();
          return $.jGrowl("Reply message sent to " + toName);
        },
        error: function() {
          return $.jGrowl("Message could not be sent :( Please try again.");
        }
      });
    };
    ListItemView.prototype.deleteMessage = function(ev) {
      ev.preventDefault();
      this.model.destroy();
      return this.remove();
    };
    return ListItemView;
  })();
}).call(this);
