(function() {
  var __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  window.Kin.Profile.OurFamilyListView = (function(_super) {

    __extends(OurFamilyListView, _super);

    function OurFamilyListView() {
      OurFamilyListView.__super__.constructor.apply(this, arguments);
    }

    OurFamilyListView.prototype.model = null;

    OurFamilyListView.prototype.el = null;

    OurFamilyListView.prototype.tplUrl = '/templates/main/profile/our_family_list.html';

    OurFamilyListView.prototype.initialize = function() {};

    OurFamilyListView.prototype.render = function() {
      var that;
      that = this;
      return $.tmpload({
        url: this.tplUrl,
        onLoad: function(tpl) {
          var classes;
          classes = new Kin.ClassesCollection([], {
            masterId: that.model.get("_id")
          });
          return classes.fetch({
            success: function() {
              var staff;
              staff = new Kin.StaffCollection([], {
                userId: that.model.get("_id")
              });
              return staff.fetch({
                success: function() {
                  var parents;
                  parents = new Kin.ParentsCollection([], {
                    userId: that.model.get("_id")
                  });
                  return parents.fetch({
                    success: function() {
                      var children;
                      children = new Kin.ChildrenCollection([], {
                        userId: that.model.get("_id")
                      });
                      return children.fetch({
                        success: function() {
                          var $el;
                          $el = $(that.el);
                          return $el.html(tpl({
                            profile: that.model,
                            classes: classes,
                            staff: staff,
                            parents: parents,
                            children: children
                          }));
                        }
                      });
                    }
                  });
                }
              });
            }
          });
        }
      });
    };

    OurFamilyListView.prototype.findByName = function(nameToFind) {
      var $list, $parentsLists, filteredText, list, _i, _len, _results;
      $parentsLists = this.$(".parents-details");
      _results = [];
      for (_i = 0, _len = $parentsLists.length; _i < _len; _i++) {
        list = $parentsLists[_i];
        $list = $(list);
        filteredText = $list.text().toLowerCase().replace(/\\n/g, " ").replace(/\s\s/g, "");
        if (filteredText.indexOf(nameToFind) > -1) {
          _results.push($list.removeClass("hidden"));
        } else {
          _results.push($list.addClass("hidden"));
        }
      }
      return _results;
    };

    OurFamilyListView.prototype.remove = function() {
      var $el;
      $el = $(this.el);
      this.unbind();
      $el.unbind().empty();
      return this;
    };

    return OurFamilyListView;

  })(Backbone.View);

}).call(this);
