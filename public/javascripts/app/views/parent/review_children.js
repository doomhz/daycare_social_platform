(function() {
  var __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  Kin.Parent.ReviewChildrenView = (function(_super) {

    __extends(ReviewChildrenView, _super);

    function ReviewChildrenView() {
      ReviewChildrenView.__super__.constructor.apply(this, arguments);
    }

    ReviewChildrenView.prototype.tplUrl = '/templates/main/parent/review_children_box.html';

    ReviewChildrenView.prototype.currentUser = null;

    ReviewChildrenView.prototype.initialize = function(_arg) {
      this.currentUser = _arg.currentUser;
    };

    ReviewChildrenView.prototype.render = function() {
      var that;
      that = this;
      return $.tmpload({
        url: this.tplUrl,
        onLoad: function(tpl) {
          var children;
          children = new Kin.ChildrenCollection([], {
            userId: that.currentUser.get("id")
          });
          return children.fetch({
            success: function() {
              var winContent;
              winContent = tpl({
                children: children
              });
              return dWindow(winContent, {
                wrapperId: "review-children-win",
                closeOnSideClick: false,
                headerButtons: false,
                buttons: {
                  "save": "save"
                },
                buttonClick: function(btType, $win) {
                  var $form, $forms, childModel, form, hashedData, _i, _len;
                  if (btType === "save") {
                    $forms = $win.find("form");
                    for (_i = 0, _len = $forms.length; _i < _len; _i++) {
                      form = $forms[_i];
                      $form = $(form);
                      hashedData = $form.hashForm();
                      if (!hashedData.birthday.year || !hashedData.birthday.month || !hashedData.birthday.day) {
                        $.jGrowl("Please specify a correct date of birth");
                        return false;
                      }
                      if (hashedData.birthday) {
                        hashedData.birthday = "" + hashedData.birthday.year + "-" + hashedData.birthday.month + "-" + hashedData.birthday.day;
                      }
                      childModel = new Kin.ChildModel;
                      childModel.save(hashedData, {
                        success: function() {
                          $.jGrowl("Children information was updated");
                          $win.close();
                          that.currentUser.set({
                            reviewed_children: true
                          });
                          return that.currentUser.save();
                        },
                        error: function() {
                          return $.jGrowl("Children information could not be updated :( Please try again.");
                        }
                      });
                    }
                  }
                }
              });
            }
          });
        }
      });
    };

    return ReviewChildrenView;

  })(Backbone.View);

}).call(this);
