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
    MainRouter.prototype.mainColumnView = null;
    MainRouter.prototype.side1ColumnView = null;
    MainRouter.prototype.initialize = function() {
      this.loadCurrentUser();
      this.loadWindow();
      return this.loadHeaderMenu();
    };
    MainRouter.prototype.root = function() {
      this.clearColumns();
      return this.navigate('day-cares', true);
    };
    MainRouter.prototype.dayCares = function() {
      this.clearColumns();
      this.mainColumnView = new window.Kin.DayCare.ListView({
        collection: new window.Kin.DayCareCollection([], {
          url: '/day-cares'
        }),
        el: '#main-column'
      });
      return this.mainColumnView.render();
    };
    MainRouter.prototype.viewDayCare = function(id) {
      var dayCare, that;
      that = this;
      this.clearColumns();
      dayCare = new window.Kin.DayCareModel({
        _id: id
      });
      return dayCare.fetch({
        success: function(model, response) {
          model.setPictureSets();
          that.mainColumnView = new window.Kin.DayCare.ProfileView({
            model: model,
            el: '#main-column',
            router: that,
            currentUser: Kin.currentUser
          });
          that.mainColumnView.render();
          that.side1ColumnView = new window.Kin.DayCare.ProfileSide1View({
            model: model,
            el: '#side-column1',
            currentUser: Kin.currentUser,
            selectedMenuItem: "wall-menu-item"
          });
          return that.side1ColumnView.render();
        }
      });
    };
    MainRouter.prototype.viewDayCareGallery = function(id) {
      var dayCare, that;
      that = this;
      this.clearColumns();
      dayCare = new window.Kin.DayCareModel({
        _id: id
      });
      return dayCare.fetch({
        success: function(model, response) {
          model.setPictureSets();
          that.mainColumnView = new window.Kin.DayCare.ProfileGalleryView({
            model: model,
            el: '#main-column',
            router: that,
            currentUser: Kin.currentUser
          });
          that.mainColumnView.render();
          that.side1ColumnView = new window.Kin.DayCare.ProfileSide1View({
            model: model,
            el: '#side-column1',
            selectedMenuItem: 'gallery-menu-item',
            currentUser: Kin.currentUser
          });
          return that.side1ColumnView.render();
        }
      });
    };
    MainRouter.prototype.editDayCare = function(id) {
      var dayCare, that;
      that = this;
      this.clearColumns();
      dayCare = new window.Kin.DayCareModel({
        _id: id
      });
      return dayCare.fetch({
        success: function(model, response) {
          var mapCenterLat, mapCenterLng;
          mapCenterLat = model.get('location').lat;
          mapCenterLng = model.get('location').lng;
          that.mainColumnView = new window.Kin.DayCare.ProfileEditView({
            model: model,
            el: '#main-column',
            maps: new window.Kin.GoogleMapsView({
              id: '#profile-address-maps',
              mapsOptions: {
                zoom: 15,
                mapTypeId: 'google.maps.MapTypeId.ROADMAP',
                center: "new google.maps.LatLng(" + mapCenterLat + ", " + mapCenterLng + ")"
              }
            })
          });
          that.mainColumnView.render();
          that.side1ColumnView = new window.Kin.DayCare.ProfileEditSide1View({
            model: model,
            el: '#side-column1'
          });
          return that.side1ColumnView.render();
        }
      });
    };
    MainRouter.prototype.viewDayCarePictureSet = function(id) {
      var pictureSet, that;
      that = this;
      this.clearColumns();
      pictureSet = new window.Kin.PictureSetModel({
        _id: id
      });
      return pictureSet.fetch({
        success: function(model, response) {
          that.mainColumnView = new window.Kin.DayCare.PictureSetView({
            model: model,
            el: '#main-column',
            currentUser: Kin.currentUser
          });
          that.mainColumnView.render();
          that.side1ColumnView = new window.Kin.DayCare.PictureSetSide1View({
            model: model,
            el: '#side-column1',
            currentUser: Kin.currentUser
          });
          return that.side1ColumnView.render();
        }
      });
    };
    MainRouter.prototype.writeMessage = function(id) {
      var draftMessage, that, usersCollection;
      that = this;
      this.clearColumns();
      usersCollection = new Kin.UsersCollection;
      if (id) {
        draftMessage = new Kin.MessageModel({
          _id: id
        });
      }
      that.mainColumnView = new window.Kin.Messages.WriteView({
        el: '#main-column',
        collection: usersCollection,
        model: draftMessage
      });
      that.mainColumnView.render();
      that.side1ColumnView = new window.Kin.Messages.InboxSide1View({
        el: '#side-column1',
        selectedMenuItem: "write-menu-item"
      });
      return that.side1ColumnView.render();
    };
    MainRouter.prototype.viewInboxMessages = function() {
      var messagesCollection, that;
      that = this;
      this.clearColumns();
      messagesCollection = new window.Kin.MessagesCollection([], {
        url: "/messages/default"
      });
      that.mainColumnView = new window.Kin.Messages.InboxView({
        el: '#main-column',
        collection: messagesCollection
      });
      that.mainColumnView.render();
      that.side1ColumnView = new window.Kin.Messages.InboxSide1View({
        el: '#side-column1',
        selectedMenuItem: "inbox-menu-item"
      });
      return that.side1ColumnView.render();
    };
    MainRouter.prototype.viewDraftMessages = function() {
      var messagesCollection, that;
      that = this;
      this.clearColumns();
      messagesCollection = new window.Kin.MessagesCollection([], {
        url: "/messages/draft"
      });
      that.mainColumnView = new window.Kin.Messages.DraftView({
        el: '#main-column',
        collection: messagesCollection
      });
      that.mainColumnView.render();
      that.side1ColumnView = new window.Kin.Messages.DraftSide1View({
        el: '#side-column1',
        selectedMenuItem: "draft-menu-item"
      });
      return that.side1ColumnView.render();
    };
    MainRouter.prototype.viewSentMessages = function() {
      var messagesCollection, that;
      that = this;
      this.clearColumns();
      messagesCollection = new window.Kin.MessagesCollection([], {
        url: "/messages/sent"
      });
      that.mainColumnView = new window.Kin.Messages.SentView({
        el: '#main-column',
        collection: messagesCollection
      });
      that.mainColumnView.render();
      that.side1ColumnView = new window.Kin.Messages.SentSide1View({
        el: '#side-column1',
        selectedMenuItem: "sent-menu-item"
      });
      return that.side1ColumnView.render();
    };
    MainRouter.prototype.viewTrashMessages = function() {
      var messagesCollection, that;
      that = this;
      this.clearColumns();
      messagesCollection = new window.Kin.MessagesCollection([], {
        url: "/messages/deleted"
      });
      that.mainColumnView = new window.Kin.Messages.TrashView({
        el: '#main-column',
        collection: messagesCollection
      });
      that.mainColumnView.render();
      that.side1ColumnView = new window.Kin.Messages.TrashSide1View({
        el: '#side-column1',
        selectedMenuItem: "trash-menu-item"
      });
      return that.side1ColumnView.render();
    };
    MainRouter.prototype.clearColumns = function(columns) {
      var column, _i, _len, _results;
      if (columns == null) {
        columns = ['main', 'side1'];
      }
      _results = [];
      for (_i = 0, _len = columns.length; _i < _len; _i++) {
        column = columns[_i];
        _results.push(this["" + column + "ColumnView"] && this["" + column + "ColumnView"].remove());
      }
      return _results;
    };
    MainRouter.prototype.loadCurrentUser = function() {
      Kin.currentUser = new Kin.UserModel();
      return Kin.currentUser.fetch({
        success: function(model) {
          if (!model.get('_id')) {
            return window.location = '/login';
          }
        }
      });
    };
    MainRouter.prototype.loadWindow = function() {
      return Kin.window = new Kin.WindowView();
    };
    MainRouter.prototype.loadHeaderMenu = function() {
      var headerSettingsSubmenu;
      headerSettingsSubmenu = new Kin.Header.SubmenuView({
        el: "header #account-bt"
      });
      return Kin.window.addEventDelegate(headerSettingsSubmenu);
    };
    return MainRouter;
  })();
}).call(this);
