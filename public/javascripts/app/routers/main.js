(function() {
  var __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  window.Kin.MainRouter = (function(_super) {

    __extends(MainRouter, _super);

    function MainRouter() {
      MainRouter.__super__.constructor.apply(this, arguments);
    }

    MainRouter.prototype.app = null;

    MainRouter.prototype.routes = {
      '': 'root',
      'day-cares': 'dayCares',
      'profiles/view/:id': 'viewProfile',
      'profiles/view/gallery/:id': 'viewProfileGallery',
      'profiles/edit/:id': 'editProfile',
      'profiles/view/picture-set/:id': 'viewProfilePictureSet',
      'profiles/view/our-family/:id': 'viewOurFamily',
      'messages/write': 'writeMessage',
      'messages/write/:id': 'writeMessage',
      'messages/inbox': 'viewInboxMessages',
      'messages/draft': 'viewDraftMessages',
      'messages/sent': 'viewSentMessages',
      'messages/trash': 'viewTrashMessages',
      'invite-parents': 'inviteParents',
      'add-class': 'addClass',
      'manage-children/:id': 'manageChildren'
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

    MainRouter.prototype.viewProfile = function(id) {
      return this.app.renderViewProfile(id);
    };

    MainRouter.prototype.viewProfileGallery = function(id) {
      return this.app.renderViewProfileGallery(id);
    };

    MainRouter.prototype.editProfile = function(id) {
      return this.app.renderEditProfile(id);
    };

    MainRouter.prototype.viewProfilePictureSet = function(id) {
      return this.app.renderViewProfilePictureSet(id);
    };

    MainRouter.prototype.viewOurFamily = function(id) {
      return this.app.renderViewOurFamily(id);
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

    MainRouter.prototype.inviteParents = function() {
      return this.app.renderInviteParents();
    };

    MainRouter.prototype.addClass = function() {
      return this.app.renderAddClass();
    };

    MainRouter.prototype.manageChildren = function(id) {
      return this.app.renderManageChildren(id);
    };

    return MainRouter;

  })(Backbone.Router);

}).call(this);
