(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  Kin.AppView = (function(_super) {

    __extends(AppView, _super);

    function AppView() {
      this.onUserLoad = __bind(this.onUserLoad, this);
      AppView.__super__.constructor.apply(this, arguments);
    }

    AppView.prototype.mainColumnView = null;

    AppView.prototype.side1ColumnView = null;

    AppView.prototype.mainColumnSelector = "#main-column";

    AppView.prototype.side1ColumnSelector = "#side-column1";

    AppView.prototype.router = null;

    AppView.prototype.currentUser = null;

    AppView.prototype.window = null;

    AppView.prototype.initialize = function() {
      return this.initCurrentUser(this.onUserLoad);
    };

    AppView.prototype.onUserLoad = function() {
      this.initWindow();
      this.initHeaderMenu();
      this.initHeaderSearch();
      this.initHeaderNotification();
      this.initTopLink();
      return this.initRouter();
    };

    AppView.prototype.initRouter = function() {
      this.router = new Kin.MainRouter({
        app: this
      });
      return Backbone.history.start({
        pushState: false
      });
    };

    AppView.prototype.initCurrentUser = function(onLoad) {
      this.currentUser = new Kin.UserModel({
        url: "/profiles/me",
        autoUpdate: true
      });
      return this.currentUser.fetch({
        success: function(model) {
          if (!model.get('_id')) {
            return window.location = '/login';
          } else {
            return onLoad();
          }
        }
      });
    };

    AppView.prototype.initWindow = function() {
      return this.window = new Kin.WindowView();
    };

    AppView.prototype.initHeaderMenu = function() {
      var headerSettingsSubmenu;
      headerSettingsSubmenu = new Kin.Header.SubmenuView({
        el: "header #account-bt"
      });
      return this.window.addDelegate(headerSettingsSubmenu);
    };

    AppView.prototype.initHeaderSearch = function() {
      var headerSearch;
      return headerSearch = new Kin.Header.SearchView({
        el: "header #search-cnt"
      });
    };

    AppView.prototype.initHeaderNotification = function() {
      var followupsNotification, headerNotificationBoard, messagesNotification, wallPostsNotification;
      headerNotificationBoard = new Kin.Header.NotificationBoardView({
        el: "header #notification-board",
        currentUser: this.currentUser
      });
      messagesNotification = new Kin.Header.NotificationView({
        el: headerNotificationBoard.$(".messages"),
        indicatorId: "new-messages-total",
        listId: "last-messages",
        onShowUrl: null
      });
      headerNotificationBoard.addDelegate(messagesNotification);
      this.window.addDelegate(messagesNotification);
      wallPostsNotification = new Kin.Header.NotificationView({
        el: headerNotificationBoard.$(".ccn"),
        indicatorId: "new-wall-posts-total",
        listId: "last-wall-posts",
        onShowUrl: "/notifications/feeds"
      });
      headerNotificationBoard.addDelegate(wallPostsNotification);
      this.window.addDelegate(wallPostsNotification);
      followupsNotification = new Kin.Header.NotificationView({
        el: headerNotificationBoard.$(".notifications"),
        indicatorId: "new-followups-total",
        listId: "last-followups",
        onShowUrl: "/notifications/alerts"
      });
      headerNotificationBoard.addDelegate(followupsNotification);
      this.window.addDelegate(followupsNotification);
      return headerNotificationBoard.watch();
    };

    AppView.prototype.renderDaycares = function() {
      this.clearColumns();
      this.mainColumnView = new Kin.Profile.ListView({
        collection: new Kin.ProfileCollection([], {
          url: '/daycares'
        }),
        el: this.mainColumnSelector
      });
      return this.mainColumnView.render();
    };

    AppView.prototype.renderViewProfile = function(id) {
      var profile, that;
      that = this;
      this.clearColumns();
      profile = new Kin.ProfileModel({
        _id: id
      });
      return profile.fetch({
        success: function(model, response) {
          model.setPictureSets();
          that.mainColumnView = new Kin.Profile.ProfileView({
            model: model,
            el: that.mainColumnSelector,
            router: that.router,
            currentUser: that.currentUser
          });
          that.mainColumnView.render();
          that.side1ColumnView = new Kin.Profile.ProfileSide1View({
            model: model,
            el: that.side1ColumnSelector,
            currentUser: that.currentUser,
            selectedMenuItem: "wall-menu-item"
          });
          return that.side1ColumnView.render();
        }
      });
    };

    AppView.prototype.renderViewProfileGallery = function(id) {
      var profile, that;
      that = this;
      this.clearColumns();
      profile = new Kin.ProfileModel({
        _id: id
      });
      return profile.fetch({
        success: function(model, response) {
          model.setPictureSets();
          that.mainColumnView = new Kin.Profile.ProfileGalleryView({
            model: model,
            el: that.mainColumnSelector,
            router: that.router,
            currentUser: that.currentUser
          });
          that.mainColumnView.render();
          that.side1ColumnView = new Kin.Profile.ProfileSide1View({
            model: model,
            el: that.side1ColumnSelector,
            selectedMenuItem: 'gallery-menu-item',
            currentUser: that.currentUser
          });
          return that.side1ColumnView.render();
        }
      });
    };

    AppView.prototype.renderEditProfile = function(id) {
      var profile, that;
      that = this;
      this.clearColumns();
      profile = new Kin.ProfileModel({
        _id: id
      });
      return profile.fetch({
        success: function(model, response) {
          var mapCenterLat, mapCenterLng;
          mapCenterLat = model.get('location').lat;
          mapCenterLng = model.get('location').lng;
          that.mainColumnView = new Kin.Profile.ProfileEditView({
            model: model,
            el: that.mainColumnSelector,
            maps: new Kin.GoogleMapsView({
              id: '#profile-address-maps',
              mapsOptions: {
                zoom: 16,
                mapTypeId: 'google.maps.MapTypeId.ROADMAP',
                center: "new google.maps.LatLng(" + mapCenterLat + ", " + mapCenterLng + ")"
              }
            })
          });
          that.mainColumnView.render();
          that.side1ColumnView = new Kin.Profile.ProfileEditSide1View({
            model: model,
            el: that.side1ColumnSelector
          });
          return that.side1ColumnView.render();
        }
      });
    };

    AppView.prototype.renderViewProfilePictureSet = function(id) {
      var pictureSet, that;
      that = this;
      this.clearColumns();
      pictureSet = new Kin.PictureSetModel({
        _id: id
      });
      return pictureSet.fetch({
        success: function(model, response) {
          that.mainColumnView = new Kin.Profile.PictureSetView({
            model: model,
            el: that.mainColumnSelector,
            currentUser: that.currentUser
          });
          that.mainColumnView.render();
          that.side1ColumnView = new Kin.Profile.PictureSetSide1View({
            model: model,
            el: that.side1ColumnSelector,
            currentUser: that.currentUser
          });
          return that.side1ColumnView.render();
        }
      });
    };

    AppView.prototype.renderWriteMessage = function(id) {
      var draftMessage, usersCollection;
      this.clearColumns();
      usersCollection = new Kin.UsersCollection;
      if (id) {
        draftMessage = new Kin.MessageModel({
          _id: id
        });
      }
      this.mainColumnView = new Kin.Messages.WriteView({
        el: this.mainColumnSelector,
        collection: usersCollection,
        model: draftMessage
      });
      this.mainColumnView.render();
      this.side1ColumnView = new Kin.Messages.InboxSide1View({
        el: this.side1ColumnSelector,
        selectedMenuItem: "write-menu-item"
      });
      return this.side1ColumnView.render();
    };

    AppView.prototype.renderViewInboxMessages = function() {
      var messagesCollection;
      this.clearColumns();
      messagesCollection = new Kin.MessagesCollection([], {
        url: "/messages/default"
      });
      this.mainColumnView = new Kin.Messages.InboxView({
        el: this.mainColumnSelector,
        collection: messagesCollection
      });
      this.mainColumnView.render();
      this.side1ColumnView = new Kin.Messages.InboxSide1View({
        el: this.side1ColumnSelector,
        selectedMenuItem: "inbox-menu-item"
      });
      return this.side1ColumnView.render();
    };

    AppView.prototype.renderViewDraftMessages = function() {
      var messagesCollection;
      this.clearColumns();
      messagesCollection = new Kin.MessagesCollection([], {
        url: "/messages/draft"
      });
      this.mainColumnView = new Kin.Messages.DraftView({
        el: this.mainColumnSelector,
        collection: messagesCollection
      });
      this.mainColumnView.render();
      this.side1ColumnView = new Kin.Messages.DraftSide1View({
        el: this.side1ColumnSelector,
        selectedMenuItem: "draft-menu-item"
      });
      return this.side1ColumnView.render();
    };

    AppView.prototype.renderViewSentMessages = function() {
      var messagesCollection;
      this.clearColumns();
      messagesCollection = new Kin.MessagesCollection([], {
        url: "/messages/sent"
      });
      this.mainColumnView = new Kin.Messages.SentView({
        el: this.mainColumnSelector,
        collection: messagesCollection
      });
      this.mainColumnView.render();
      this.side1ColumnView = new Kin.Messages.SentSide1View({
        el: this.side1ColumnSelector,
        selectedMenuItem: "sent-menu-item"
      });
      return this.side1ColumnView.render();
    };

    AppView.prototype.renderViewTrashMessages = function() {
      var messagesCollection;
      this.clearColumns();
      messagesCollection = new Kin.MessagesCollection([], {
        url: "/messages/deleted"
      });
      this.mainColumnView = new Kin.Messages.TrashView({
        el: this.mainColumnSelector,
        collection: messagesCollection
      });
      this.mainColumnView.render();
      this.side1ColumnView = new Kin.Messages.TrashSide1View({
        el: this.side1ColumnSelector,
        selectedMenuItem: "trash-menu-item"
      });
      return this.side1ColumnView.render();
    };

    AppView.prototype.renderInviteParents = function() {
      var friendRequests, that;
      that = this;
      this.clearColumns();
      friendRequests = new Kin.FriendRequestsCollection([], {
        url: "/friend-requests"
      });
      that.mainColumnView = new Kin.DayCare.InvitesView({
        el: that.mainColumnSelector,
        collection: friendRequests
      });
      that.mainColumnView.render();
      that.side1ColumnView = new Kin.DayCare.InvitesSide1View({
        model: this.currentUser,
        el: that.side1ColumnSelector
      });
      return that.side1ColumnView.render();
    };

    AppView.prototype.initTopLink = function() {
      return $('#top-link').topLink();
    };

    AppView.prototype.clearColumns = function(columns) {
      var column, _i, _len, _results;
      if (columns == null) columns = ['main', 'side1'];
      _results = [];
      for (_i = 0, _len = columns.length; _i < _len; _i++) {
        column = columns[_i];
        _results.push(this["" + column + "ColumnView"] && this["" + column + "ColumnView"].remove());
      }
      return _results;
    };

    return AppView;

  })(Backbone.View);

}).call(this);
