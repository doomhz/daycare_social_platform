(function() {
  var __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  Kin.Messages.DraftView = (function(_super) {

    __extends(DraftView, _super);

    function DraftView() {
      DraftView.__super__.constructor.apply(this, arguments);
    }

    return DraftView;

  })(Kin.Messages.InboxView);

}).call(this);
