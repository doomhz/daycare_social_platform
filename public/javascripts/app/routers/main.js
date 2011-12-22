(function() {
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  };
  window.Kin.MainRouter = (function() {
    __extends(MainRouter, Backbone.Router);
    function MainRouter() {
      MainRouter.__super__.constructor.apply(this, arguments);
    }
    MainRouter.prototype.app = null;
    MainRouter.prototype.routes = {
      '': 'root',
      'day-cares': 'dayCares',
      'day-cares/view/:id': 'viewDayCare',
      'day-cares/view/gallery/:id': 'viewDayCareGallery',
      'day-cares/edit/:id': 'editDayCare',
      'day-cares/view/picture-set/:id': 'viewDayCarePictureSet',
      'messages/write': 'writeMessage',
      'messages/write/:id': 'writeMessage',
      'messages/inbox': 'viewInboxMessages',
      'messages/draft': 'viewDraftMessages',
      'messages/sent': 'viewSentMessages',
      'messages/trash': 'viewTrashMessages'
    };
    MainRouter.prototype.initialize = function(_arg) {
      this.app = _arg.app;
    };
    MainRouter.prototype.root = function() {
      return this.navigate('day-cares', true);
    };
    MainRouter.prototype.dayCares = function() {
      return this.app.renderDaycares();
    };
    MainRouter.prototype.viewDayCare = function(id) {
      return this.app.renderViewDaycare(id);
    };
    MainRouter.prototype.viewDayCareGallery = function(id) {
      return this.app.renderViewDayCareGallery(id);
    };
    MainRouter.prototype.editDayCare = function(id) {
      return this.app.renderEditDayCare(id);
    };
    MainRouter.prototype.viewDayCarePictureSet = function(id) {
      return this.app.renderViewDayCarePictureSet(id);
    };
    MainRouter.prototype.writeMessage = function(id) {
      return this.app.renderWriteMessage(id);
    };
    MainRouter.prototype.viewInboxMessages = function() {
      return this.app.renderViewInboxMessages();
    };
    MainRouter.prototype.viewDraftMessages = function() {
      return this.app.renderViewDraftMessages();
    };
    MainRouter.prototype.viewSentMessages = function() {
      return this.app.renderViewSentMessages();
    };
    MainRouter.prototype.viewTrashMessages = function() {
      return this.app.renderViewTrashMessages();
    };
    return MainRouter;
  })();
}).call(this);
