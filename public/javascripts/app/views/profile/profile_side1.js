(function() {
  var __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  window.Kin.Profile.ProfileSide1View = (function(_super) {

    __extends(ProfileSide1View, _super);

    function ProfileSide1View() {
      ProfileSide1View.__super__.constructor.apply(this, arguments);
    }

    ProfileSide1View.prototype.el = null;

    ProfileSide1View.prototype.tplUrl = {
      daycare: '/templates/side1/day_care/profile.html',
      parent: '/templates/side1/parent/profile.html',
      staff: '/templates/side1/staff/profile.html',
      "class": '/templates/side1/class/profile.html',
      section: '/templates/side1/day_care/profile.html'
    };

    ProfileSide1View.prototype.quickMessageTplUrl = '/templates/side1/messages/quick_message_box.html';

    ProfileSide1View.prototype.selectedMenuItem = null;

    ProfileSide1View.prototype.events = {
      "click #quick-message-bt": "quickMessageHandler"
    };

    ProfileSide1View.prototype.initialize = function(_arg) {
      this.selectedMenuItem = _arg.selectedMenuItem;
      this.model && (this.model.view = this);
      return this;
    };

    ProfileSide1View.prototype.render = function() {
      var that;
      that = this;
      $.tmpload({
        url: this.tplUrl[this.model.get("type")],
        onLoad: function(tpl) {
          return $(that.el).html(tpl({
            profile: that.model,
            selectedMenuItem: that.selectedMenuItem
          }));
        }
      });
      return this;
    };

    ProfileSide1View.prototype.remove = function() {
      this.unbind();
      $(this.el).unbind().empty();
      return this;
    };

    ProfileSide1View.prototype.quickMessageHandler = function(ev) {
      ev.preventDefault();
      return this.showQuickMessageWindow(this.model);
    };

    ProfileSide1View.prototype.showQuickMessageWindow = function(profile) {
      var that;
      that = this;
      return $.tmpload({
        url: this.quickMessageTplUrl,
        onLoad: function(tpl) {
          var winContent;
          winContent = tpl({
            profile: profile
          });
          return dWindow(winContent, {
            wrapperId: "quick-message-win",
            closeOnSideClick: false,
            buttons: {
              "send": "send",
              "cancel": "cancel"
            },
            buttonClick: function(btType, $win) {
              var $form, formData, messageModel;
              if (btType === "send") {
                $form = $win.find("form:first");
                formData = $form.serialize();
                messageModel = new Kin.MessageModel;
                messageModel.save(null, {
                  data: formData,
                  success: function() {
                    var toName;
                    toName = $win.find("#message-to-name").text();
                    return $.jGrowl("Message sent to " + toName);
                  },
                  error: function() {
                    return $.jGrowl("Message could not be sent :( Please try again.");
                  }
                });
              }
              return $win.close();
            }
          });
        }
      });
    };

    return ProfileSide1View;

  })(Backbone.View);

}).call(this);
