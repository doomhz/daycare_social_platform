(function() {
  var __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; },
    __indexOf = Array.prototype.indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  window.Kin.Profile.OurFamilyListView = (function(_super) {

    __extends(OurFamilyListView, _super);

    function OurFamilyListView() {
      OurFamilyListView.__super__.constructor.apply(this, arguments);
    }

    OurFamilyListView.prototype.model = null;

    OurFamilyListView.prototype.el = null;

    OurFamilyListView.prototype.tplUrl = '/templates/main/profile/our_family_list.html';

    OurFamilyListView.prototype.membersLists = null;

    OurFamilyListView.prototype.staff = null;

    OurFamilyListView.prototype.parents = null;

    OurFamilyListView.prototype.children = null;

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
              that.staff = new Kin.StaffCollection([], {
                userId: that.model.get("_id")
              });
              return that.staff.fetch({
                success: function() {
                  that.parents = new Kin.ParentsCollection([], {
                    userId: that.model.get("_id")
                  });
                  return that.parents.fetch({
                    success: function() {
                      that.children = new Kin.ChildrenCollection([], {
                        userId: that.model.get("_id")
                      });
                      return that.children.fetch({
                        success: function() {
                          var $el;
                          $el = $(that.el);
                          return $el.html(tpl({
                            profile: that.model,
                            classes: classes,
                            staff: that.staff,
                            parents: that.parents,
                            children: that.children
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

    OurFamilyListView.prototype.findByNameAndType = function(nameToFind, typeToFind) {
      var memberId, memberIds, _i, _len, _results;
      this.membersLists = this.membersLists || this.$(".our-family-member");
      this.membersLists.addClass("hidden");
      memberIds = this.filterMembers(nameToFind, typeToFind);
      _results = [];
      for (_i = 0, _len = memberIds.length; _i < _len; _i++) {
        memberId = memberIds[_i];
        _results.push(this.membersLists.filter("#member-" + memberId).removeClass("hidden"));
      }
      return _results;
    };

    OurFamilyListView.prototype.filterMembers = function(slug, type) {
      var children, childrenIds, memberIds, types;
      types = type === "all" ? ["staff", "parents", "children"] : [type];
      memberIds = [];
      childrenIds = [];
      if (__indexOf.call(types, "staff") >= 0) {
        this.staff.each(function(st) {
          if (("" + (st.get('name')) + " " + (st.get('surname'))).toLowerCase().indexOf(slug) > -1) {
            return memberIds.push(st.get("_id"));
          }
        });
      }
      if (__indexOf.call(types, "children") >= 0) {
        children = this.children.filter(function(child) {
          return ("" + (child.get('name')) + " " + (child.get('surname'))).toLowerCase().indexOf(slug) > -1;
        });
        childrenIds = _.map(children, function(child) {
          return child.get("_id");
        });
        this.parents.each(function(parent) {
          var foundChildren;
          foundChildren = _.intersection(childrenIds, parent.get("children_ids")).length;
          if (foundChildren) return memberIds.push(parent.get("_id"));
        });
      }
      if (__indexOf.call(types, "parents") >= 0) {
        this.parents.each(function(parent) {
          var foundChildren;
          foundChildren = _.intersection(childrenIds, parent.get("children_ids")).length;
          if (("" + (parent.get('name')) + " " + (parent.get('surname'))).toLowerCase().indexOf(slug) > -1) {
            return memberIds.push(parent.get("_id"));
          }
        });
      }
      return _.uniq(memberIds);
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
