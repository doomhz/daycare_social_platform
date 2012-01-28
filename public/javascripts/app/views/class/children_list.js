(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  Kin.Class.ChildrenListView = (function(_super) {

    __extends(ChildrenListView, _super);

    function ChildrenListView() {
      this.deleteChildHandler = __bind(this.deleteChildHandler, this);
      this.render = __bind(this.render, this);
      ChildrenListView.__super__.constructor.apply(this, arguments);
    }

    ChildrenListView.prototype.collection = null;

    ChildrenListView.prototype.model = null;

    ChildrenListView.prototype.tplUrl = '/templates/main/class/children_list.html';

    ChildrenListView.prototype.events = {
      "click .delete-child": "deleteChildHandler"
    };

    ChildrenListView.prototype.initialize = function() {};

    ChildrenListView.prototype.render = function() {
      var that;
      that = this;
      return $.tmpload({
        url: this.tplUrl,
        onLoad: function(tpl) {
          return that.collection.fetch({
            success: function() {
              var $el;
              $el = $(that.el);
              $el.html(tpl({
                children: that.collection,
                profile: that.model
              }));
              return that.$(".dedit-input-link").doomEdit({
                ajaxSubmit: false,
                submitOnBlur: true,
                submitBtn: false,
                cancelBtn: false,
                afterFormSubmit: function(data, form, $el) {
                  var child, childId, fieldName;
                  $el.text(data);
                  fieldName = $el.data("field");
                  childId = $el.data("id");
                  child = new Kin.ChildModel({
                    _id: childId
                  });
                  child.attributes[fieldName] = data;
                  return child.save(null, {
                    silent: true
                  });
                }
              });
            }
          });
        }
      });
    };

    ChildrenListView.prototype.deleteChildHandler = function(ev) {
      var child, childId;
      ev.preventDefault();
      childId = $(ev.target).data("id");
      child = new Kin.ChildModel({
        _id: childId
      });
      return child.destroy({
        success: this.render
      });
    };

    return ChildrenListView;

  })(Backbone.View);

}).call(this);
