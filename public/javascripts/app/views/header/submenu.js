(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; }, __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  };
  Kin.Header.SubmenuView = (function() {
    __extends(SubmenuView, Backbone.View);
    function SubmenuView() {
      this.menuButtonClickHandler = __bind(this.menuButtonClickHandler, this);
      SubmenuView.__super__.constructor.apply(this, arguments);
    }
    SubmenuView.prototype.el = null;
    SubmenuView.prototype.submenuSelector = "ul.submenu";
    SubmenuView.prototype.doNotClose = false;
    SubmenuView.prototype.initialize = function() {
      this.bind("click:window", this.windowClickHandler);
      return this.$("a:first").bind("click", this.menuButtonClickHandler);
    };
    SubmenuView.prototype.menuButtonClickHandler = function(ev) {
      ev.preventDefault();
      if (this.$(this.submenuSelector).hasClass("hidden")) {
        this.selectMenuItem();
        this.showSubmenu();
        return this.doNotClose = true;
      }
    };
    SubmenuView.prototype.windowClickHandler = function(ev) {
      if (!this.doNotClose) {
        this.deselectMenuItem();
        return this.hideSubmenu();
      } else {
        return this.doNotClose = false;
      }
    };
    SubmenuView.prototype.showSubmenu = function() {
      return this.$(this.submenuSelector).removeClass("hidden");
    };
    SubmenuView.prototype.hideSubmenu = function() {
      return this.$(this.submenuSelector).addClass("hidden");
    };
    SubmenuView.prototype.selectMenuItem = function() {
      return $(this.el).addClass("selected");
    };
    SubmenuView.prototype.deselectMenuItem = function() {
      return $(this.el).removeClass("selected");
    };
    return SubmenuView;
  })();
}).call(this);
