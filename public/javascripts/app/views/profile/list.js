(function() {
  var __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  window.Kin.Profile.ListView = (function(_super) {

    __extends(ListView, _super);

    function ListView() {
      ListView.__super__.constructor.apply(this, arguments);
    }

    ListView.prototype.el = null;

    ListView.prototype.collection = null;

    ListView.prototype.profileModelView = window.Kin.Profile.ListItemView;

    ListView.prototype.tplUrl = '/templates/main/day_care/list.html';

    ListView.prototype.lisItemTplUrl = '/templates/main/day_care/list_item.html';

    ListView.prototype.initialize = function() {
      _.bindAll(this, 'render', 'addProfileListItem');
      if (this.collection) {
        this.collection.bind('add', this.addProfileListItem);
        this.collection.bind('fetch', this.addProfileListItem);
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
          return $.tmpload({
            url: that.lisItemTplUrl,
            onLoad: function() {
              return that.collection.fetch({
                add: true
              });
            }
          });
        }
      });
      return this;
    };

    ListView.prototype.addProfileListItem = function(profileModel) {
      var $list, profileView;
      profileView = new this.profileModelView({
        model: profileModel
      });
      $list = $(this.el).find('ol:first');
      $list.append(profileView.el);
      profileView.render();
      return this;
    };

    ListView.prototype.remove = function() {
      this.unbind();
      $(this.el).unbind().empty();
      return this;
    };

    return ListView;

  })(Backbone.View);

}).call(this);
