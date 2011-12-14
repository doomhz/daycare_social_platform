(function() {
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  };
  Kin.Messages.SentSide1View = (function() {
    __extends(SentSide1View, Kin.Messages.InboxSide1View);
    function SentSide1View() {
      SentSide1View.__super__.constructor.apply(this, arguments);
    }
    return SentSide1View;
  })();
}).call(this);
