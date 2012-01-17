(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  Kin.Messages.WriteView = (function(_super) {

    __extends(WriteView, _super);

    function WriteView() {
      this.renderWhenCollectionLoaded = __bind(this.renderWhenCollectionLoaded, this);
      WriteView.__super__.constructor.apply(this, arguments);
    }

    WriteView.prototype.el = null;

    WriteView.prototype.tplUrl = '/templates/main/messages/write.html';

    WriteView.prototype.tpl = null;

    WriteView.prototype.collection = null;

    WriteView.prototype.events = {
      "submit #write-message-form": "sendMessage",
      "click #save-draft-message-bt": "saveDraftMessage"
    };

    WriteView.prototype.initialize = function() {};

    WriteView.prototype.render = function() {
      var that;
      that = this;
      return $.tmpload({
        url: this.tplUrl,
        onLoad: function(tpl) {
          that.tpl = tpl;
          if (that.model) {
            return that.model.fetch({
              success: that.renderWhenCollectionLoaded
            });
          } else {
            return that.renderWhenCollectionLoaded();
          }
        }
      });
    };

    WriteView.prototype.renderWhenCollectionLoaded = function() {
      var that;
      that = this;
      return this.collection.fetch({
        success: function() {
          $(that.el).html(that.tpl({
            users: that.collection,
            message: that.model
          }));
          that.$(".chzn-select").chosen();
          return that.$("textarea:first").autoResize({
            extraSpace: 30
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

    WriteView.prototype.saveDraftMessage = function(ev) {
      var $form, formData, messageModel, that;
      ev.preventDefault();
      that = this;
      $form = that.$("#write-message-form");
      formData = $form.serialize();
      formData = formData.replace("type=default", "type=draft");
      messageModel = new Kin.MessageModel;
      return messageModel.save(null, {
        data: formData,
        success: function() {
          return $.jGrowl("Draft message saved");
        },
        error: function() {
          return $.jGrowl("Message could not be saved :( Please try again.");
        }
      });
    };

    WriteView.prototype.remove = function() {
      this.unbind();
      return $(this.el).unbind().empty();
    };

    return WriteView;

  })(Backbone.View);

}).call(this);
