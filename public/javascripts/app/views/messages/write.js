(function() {
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  };
  Kin.Messages.WriteView = (function() {
    __extends(WriteView, Backbone.View);
    function WriteView() {
      WriteView.__super__.constructor.apply(this, arguments);
    }
    WriteView.prototype.el = null;
    WriteView.prototype.tplUrl = '/templates/main/messages/write.html';
    WriteView.prototype.collection = null;
    WriteView.prototype.events = {
      "submit #write-message-form": "sendMessage"
    };
    WriteView.prototype.initialize = function() {};
    WriteView.prototype.render = function() {
      var that;
      that = this;
      return $.tmpload({
        url: this.tplUrl,
        onLoad: function(tpl) {
          return that.collection.fetch({
            success: function() {
              $(that.el).html(tpl({
                users: that.collection
              }));
              that.$(".chzn-select").chosen();
              return that.$("textarea:first").autoResize({
                extraSpace: 30
              });
            }
          });
        }
      });
    };
    WriteView.prototype.sendMessage = function(ev) {
      var $form, formData, messageModel, that;
      ev.preventDefault();
      that = this;
      $form = $(ev.target);
      formData = $form.serialize();
      messageModel = new Kin.MessageModel;
      return messageModel.save(null, {
        data: formData,
        success: function() {
          $form.find("textarea:first").val("").keyup();
          return $.jGrowl("Message sent");
        },
        error: function() {
          return $.jGrowl("Message could not be sent :( Please try again.");
        }
      });
    };
    WriteView.prototype.remove = function() {
      this.unbind();
      return $(this.el).unbind().empty();
    };
    return WriteView;
  })();
}).call(this);
