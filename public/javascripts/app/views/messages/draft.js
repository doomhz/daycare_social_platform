(function() {
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  };
  Kin.Messages.DraftView = (function() {
    __extends(DraftView, Kin.Messages.InboxView);
    function DraftView() {
      DraftView.__super__.constructor.apply(this, arguments);
    }
    DraftView.prototype.tplUrl = '/templates/main/messages/draft.html';
    return DraftView;
  })();
}).call(this);