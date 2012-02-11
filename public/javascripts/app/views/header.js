(function() {
  var __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  Kin.HeaderView = (function(_super) {

    __extends(HeaderView, _super);

    function HeaderView() {
      HeaderView.__super__.constructor.apply(this, arguments);
    }

    HeaderView.prototype.el = "header";

    HeaderView.prototype.initialize = function() {};

    HeaderView.prototype.render = function() {
      return this.showElements(["#main-menu", "#events-menu", "#search-cnt"]);
    };

    HeaderView.prototype.showElements = function(elements) {
      var element, _i, _len, _results;
      if (elements == null) elements = [];
      _results = [];
      for (_i = 0, _len = elements.length; _i < _len; _i++) {
        element = elements[_i];
        _results.push(this.$(element).removeClass("hidden"));
      }
      return _results;
    };

    return HeaderView;

  })(Backbone.View);

}).call(this);
