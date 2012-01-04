(function() {
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  };
  Kin.Header.SearchView = (function() {
    __extends(SearchView, Backbone.View);
    function SearchView() {
      SearchView.__super__.constructor.apply(this, arguments);
    }
    SearchView.prototype.el = null;
    SearchView.prototype.events = {
      "mouseenter": "mouseEnterHandler",
      "mouseleave": "mouseLeaveHandler"
    };
    SearchView.prototype.initialize = function() {};
    SearchView.prototype.mouseEnterHandler = function() {
      return this.$("#search-menu").removeClass("invisible");
    };
    SearchView.prototype.mouseLeaveHandler = function() {
      return this.$("#search-menu").addClass("invisible");
    };
    return SearchView;
  })();
}).call(this);
