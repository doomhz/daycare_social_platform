(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  Kin.Messages.InboxView = (function(_super) {

    __extends(InboxView, _super);

    function InboxView() {
      this.addMessagesListItem = __bind(this.addMessagesListItem, this);
      InboxView.__super__.constructor.apply(this, arguments);
    }

    InboxView.prototype.el = null;

    InboxView.prototype.collection = null;

    InboxView.prototype.messageModelView = window.Kin.Messages.ListItemView;

    InboxView.prototype.tplUrl = '/templates/main/messages/inbox.html';

    InboxView.prototype.listItemTplUrl = '/templates/main/messages/list_item.html';

    InboxView.prototype.initialize = function() {
      if (this.collection) {
        this.collection.bind('add', this.addMessagesListItem);
        return this.collection.bind('fetch', this.addMessagesListItem);
      }
    };

    InboxView.prototype.render = function() {
      var that;
      that = this;
      return $.tmpload({
        url: this.tplUrl,
        onLoad: function(tpl) {
          $(that.el).html(tpl());
          return $.tmpload({
            url: that.listItemTplUrl,
            onLoad: function(tpl) {
              return that.collection.fetch({
                add: true
              });
            }
          });
        }
      });
    };

    InboxView.prototype.addMessagesListItem = function(messageModel) {
      var $list, messageView;
      messageView = new this.messageModelView({
        model: messageModel
      });
      $list = $(this.el).find('#messages-list');
      $list.append(messageView.el);
      return messageView.render();
    };

    InboxView.prototype.remove = function() {
      this.unbind();
      return $(this.el).unbind().empty();
    };

    return InboxView;

  })(Backbone.View);

}).call(this);
