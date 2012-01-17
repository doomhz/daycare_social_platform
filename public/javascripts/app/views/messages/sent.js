(function() {
  var __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  Kin.Messages.SentView = (function(_super) {

    __extends(SentView, _super);

    function SentView() {
      SentView.__super__.constructor.apply(this, arguments);
    }

    return SentView;

  })(Kin.Messages.InboxView);

}).call(this);
