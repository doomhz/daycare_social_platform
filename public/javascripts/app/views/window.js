(function() {
  var __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  Kin.WindowView = (function(_super) {

    __extends(WindowView, _super);

    function WindowView() {
      WindowView.__super__.constructor.apply(this, arguments);
    }

    WindowView.prototype.el = window;

    WindowView.prototype.events = {
      "click": "clickHandler"
    };

    WindowView.prototype.delegates = [];

    WindowView.prototype.clickHandler = function(ev) {
      return this.announceDelegates(ev);
    };

    WindowView.prototype.announceDelegates = function(ev) {
      var eventDelegate, _i, _len, _ref, _results;
      _ref = this.delegates;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        eventDelegate = _ref[_i];
        _results.push(eventDelegate.trigger("click:window", ev));
      }
      return _results;
    };

    WindowView.prototype.addDelegate = function(delegate) {
      return this.delegates.push(delegate);
    };

    return WindowView;

  })(Backbone.View);

}).call(this);
