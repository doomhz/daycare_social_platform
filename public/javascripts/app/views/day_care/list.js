(function() {
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  };
  window.Kin.DayCare.ListView = (function() {
    __extends(ListView, Backbone.View);
    function ListView() {
      ListView.__super__.constructor.apply(this, arguments);
    }
    ListView.prototype.el = null;
    ListView.prototype.collection = null;
    ListView.prototype.dayCareModelView = window.Kin.DayCare.ListItemView;
    ListView.prototype.tplUrl = '/templates/main/day_care/list.html';
    ListView.prototype.initialize = function() {
      _.bindAll(this, 'render', 'addDayCareListItem');
      if (this.collection) {
        this.collection.bind('add', this.addDayCareListItem);
        this.collection.bind('fetch', this.addDayCareListItem);
      }
      return this;
    };
    ListView.prototype.render = function(afterLoad) {
      var that;
      that = this;
      $.tmpload({
        url: this.tplUrl,
        onLoad: function(tpl) {
          $(that.el).html(tpl());
          return that.collection.fetch({
            add: true
          });
        }
      });
      return this;
    };
    ListView.prototype.addDayCareListItem = function(dayCareModel) {
      var $list, dayCareView;
      dayCareView = new this.dayCareModelView({
        model: dayCareModel
      });
      $list = $(this.el).find('ol:first');
      $list.append(dayCareView.el);
      dayCareView.render();
      return this;
    };
    ListView.prototype.remove = function() {
      this.unbind();
      $(this.el).unbind().empty();
      return this;
    };
    return ListView;
  })();
}).call(this);
