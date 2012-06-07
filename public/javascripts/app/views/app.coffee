class Kin.AppView extends Backbone.View

  el: 'body'

  mainColumnView: null

  side1ColumnView: null

  side2ColumnView: null

  mainColumnSelector: "#main-column"

  side1ColumnSelector: "#side-column1"

  side2ColumnSelector: "#side-column2"

  profileGuideSelector: "#profile-guide"

  router: null

  currentUser: null

  window: null

  modules: [
    "profileGuideView"
    "currentUser"
  ]

  initialize: ()->
    @initCurrentUser(@onUserLoad)

  onUserLoad: ()=>
    @initWindow()
    @initHeader()
    @initHeaderMenu()
    @initHeaderProfileInfo()
    @initHeaderNotification()
    @initTopLink()
    @initRouter()
    @initStartupEvents()
    @initHeaderSearch()
    @initProfileGuide()

  initRouter: ()->
    @router = new Kin.MainRouter
      app: @
    Backbone.history.start
      pushState: false

  initCurrentUser: (onLoad)->
    @currentUser = new Kin.UserModel
      url: "/profiles/me"
      autoUpdate: true
    @currentUser.fetch
      success: (model)->
        if not model.get('_id')
          window.location = '/login'
        else
          onLoad()

  initWindow: ()->
    @window = new Kin.WindowView
      el: if $.support.submitBubbles then window else "html"

  initHeader: ()->
    header = new Kin.HeaderView
      el: "#header"
    header.render()

  initHeaderMenu: ()->
    headerSettingsSubmenu = new Kin.Header.SubmenuView
      el: "#header #account-bt"
    @window.addDelegate(headerSettingsSubmenu)
    headerSettingsSubmenu.render()

  initHeaderProfileInfo: ()->
    headerProfileInfo = new Kin.Header.ProfileInfoView
      el: "#header #my-profile-bt"
      model: @currentUser
    @window.addDelegate(headerProfileInfo)
    @currentUser.addDelegate(headerProfileInfo)

  initHeaderSearch: ()->
    headerSearch = new Kin.Header.SearchView
      el: "#header #search-cnt"
      router: @router
    headerSearch.render()

  initHeaderNotification: ()->
    headerNotificationBoard = new Kin.Header.NotificationBoardView
      el: "#header #notification-board"
      currentUser: @currentUser

    messagesNotification = new Kin.Header.NotificationView
      el: headerNotificationBoard.$(".messages")
      indicatorId: "new-messages-total"
      listId: "last-messages"
      onHideUrl: null
    headerNotificationBoard.addDelegate(messagesNotification)
    @window.addDelegate(messagesNotification)

    wallPostsNotification = new Kin.Header.NotificationView
      el: headerNotificationBoard.$(".ccn")
      indicatorId: "new-wall-posts-total"
      listId: "last-wall-posts"
      onHideUrl: "/notifications/feeds"
    headerNotificationBoard.addDelegate(wallPostsNotification)
    @window.addDelegate(wallPostsNotification)

    followupsNotification = new Kin.Header.NotificationView
      el: headerNotificationBoard.$(".notifications")
      indicatorId: "new-followups-total"
      listId: "last-followups"
      onHideUrl: "/notifications/alerts"
    headerNotificationBoard.addDelegate(followupsNotification)
    @window.addDelegate(followupsNotification)

    requestsNotification = new Kin.Header.NotificationView
      el: headerNotificationBoard.$(".friend-request")
      indicatorId: "new-requests-total"
      listId: "last-requests"
      onHideUrl: "/notifications/requests"
    headerNotificationBoard.addDelegate(requestsNotification)
    @window.addDelegate(requestsNotification)

    headerNotificationBoard.watch()

  initStartupEvents: ()->
    if @currentUser.get("type") is "parent" and not @currentUser.get("reviewed_children")
      reviewChildren = new Kin.Parent.ReviewChildrenView
        currentUser: @currentUser
      reviewChildren.render()

  initTopLink: ()->
    $('#top-link').topLink()

  initProfileGuide: ()->
    @profileGuideView = new Kin.Profile.GuideView
      el: @profileGuideSelector
      model: @currentUser
    @profileGuideView.render()

  renderDaycares: ()->
    @clearColumns()

    @mainColumnView = new Kin.DayCare.SearchView
      collection: new Kin.ProfileCollection([], {url: '/daycares'})
      el: @mainColumnSelector
    @mainColumnView.render()

  renderViewProfile: (id)->
    that = @
    @clearColumns()
    profile = new Kin.ProfileModel({_id: id})
    profile.fetch
      success: (model, response)->

        model.setPictureSets()

        that.mainColumnView = new Kin.Profile.ProfileView
          model: model
          el: that.mainColumnSelector
          router: that.router
          currentUser: that.currentUser
        that.mainColumnView.render()

        that.side1ColumnView = new Kin.Profile.ProfileSide1View
          model: model
          el: that.side1ColumnSelector
          currentUser: that.currentUser
          selectedMenuItem: "wall-menu-item"
        that.side1ColumnView.render()

        that.side2ColumnView = new Kin.Profile.ProfileSide2View
          model: model
          el: that.side2ColumnSelector
          currentUser: that.currentUser
          router: that.router
        that.side2ColumnView.render()

  renderViewProfileGallery: (id)->
    that = @
    @clearColumns()
    profile = new Kin.ProfileModel({_id: id})
    profile.fetch
      success: (model, response)->

        model.setPictureSets()

        that.mainColumnView = new Kin.Profile.ProfileGalleryView
          model: model
          el: that.mainColumnSelector
          router: that.router
          currentUser: that.currentUser
        that.mainColumnView.render()

        that.side1ColumnView = new Kin.Profile.ProfileSide1View
          model: model
          el: that.side1ColumnSelector
          selectedMenuItem: 'gallery-menu-item'
          currentUser: that.currentUser
        that.side1ColumnView.render()

        that.side2ColumnView = new Kin.Profile.ProfileSide2View
          model: model
          el: that.side2ColumnSelector
          currentUser: that.currentUser
          router: that.router
        that.side2ColumnView.render()

  renderEditProfile: (id)->
    that = @
    @clearColumns()
    profile = new Kin.ProfileModel({_id: id})
    profile.fetch
      success: (model, response)->

        model.setPictureSets()

        mapCenterLat = model.get('location')[0]
        mapCenterLng = model.get('location')[1]

        that.mainColumnView = new Kin.Profile.ProfileEditView
          model: model
          el: that.mainColumnSelector
          router: that.router
          maps: new Kin.GoogleMapsView
            id: '#profile-address-maps'
            mapsOptions:
              zoom: 16
              mapTypeId: 'google.maps.MapTypeId.ROADMAP'
              center: "new google.maps.LatLng(#{mapCenterLat}, #{mapCenterLng})"
        that.mainColumnView.render()

        that.side1ColumnView = new Kin.Profile.ProfileEditSide1View
          model: model
          el: that.side1ColumnSelector
          selectedMenuItem: "edit-profile-menu-item"
        that.side1ColumnView.render()

  renderViewProfilePictureSet: (id)->
    that = @
    @clearColumns()
    pictureSet = new Kin.PictureSetModel({_id: id})
    pictureSet.fetch
      success: (model, response)->

        that.mainColumnView = new Kin.Profile.PictureSetView
          model: model
          el: that.mainColumnSelector
          currentUser: that.currentUser
        that.mainColumnView.render()

        that.side1ColumnView = new Kin.Profile.PictureSetSide1View
          model: model
          el: that.side1ColumnSelector
          currentUser: that.currentUser
        that.side1ColumnView.render()

  renderViewOurFamily: (id)->
    that = @
    @clearColumns()
    profile = new Kin.ProfileModel({_id: id})
    profile.fetch
      success: (model, response)->

        model.setPictureSets()

        that.mainColumnView = new Kin.Profile.OurFamilyView
          model: model
          el: that.mainColumnSelector
          currentUser: that.currentUser
          router: that.router
        that.mainColumnView.render()

        that.side1ColumnView = new Kin.Profile.ProfileSide1View
          model: model
          el: that.side1ColumnSelector
          selectedMenuItem: 'our-family-menu-item'
          currentUser: that.currentUser
        that.side1ColumnView.render()

        that.side2ColumnView = new Kin.Profile.ProfileSide2View
          model: model
          el: that.side2ColumnSelector
          currentUser: that.currentUser
          router: that.router
        that.side2ColumnView.render()

  renderWriteMessage: ()->
    @clearColumns()

    usersCollection = new Kin.UsersCollection

    @mainColumnView = new Kin.Messages.WriteView
      el: @mainColumnSelector
      collection: usersCollection
    @mainColumnView.render()

    @side1ColumnView = new Kin.Messages.InboxSide1View
      el: @side1ColumnSelector
      selectedMenuItem: "write-menu-item"
    @side1ColumnView.render()

  renderViewMessages: ()->
    @clearColumns()

    messagesCollection = new Kin.MessagesCollection

    @mainColumnView = new Kin.Messages.ConversationsView
      el: @mainColumnSelector
      collection: messagesCollection
    @mainColumnView.render()

    @side1ColumnView = new Kin.Messages.InboxSide1View
      el: @side1ColumnSelector
      selectedMenuItem: "inbox-menu-item"
    @side1ColumnView.render()

  renderViewMessagesFromProfile: (id)->
    @clearColumns()
    that = @

    profile = new Kin.ProfileModel({_id: id})
    profile.fetch
      success: (model, response)->
        messagesCollection = new Kin.MessagesFromProfileCollection [],
            userId: id

        that.mainColumnView = new Kin.Messages.FromProfileView
          el: that.mainColumnSelector
          collection: messagesCollection
          model: model
        that.mainColumnView.render()

        that.side1ColumnView = new Kin.Messages.InboxSide1View
          el: that.side1ColumnSelector
          selectedMenuItem: "inbox-menu-item"
        that.side1ColumnView.render()

  renderInviteParents: ()->
    that = @
    @clearColumns()

    friendRequests = new Kin.FriendRequestsCollection [], {url: "/friend-requests/parent"}

    that.mainColumnView = new Kin.Parent.InvitesView
      el: that.mainColumnSelector
      collection: friendRequests
      model: @currentUser
    that.mainColumnView.render()

    that.side1ColumnView = new Kin.Parent.InvitesSide1View
      model: @currentUser
      el: that.side1ColumnSelector
    that.side1ColumnView.render()

  renderInviteStaff: ()->
    that = @
    @clearColumns()

    friendRequests = new Kin.FriendRequestsCollection [], {url: "/friend-requests/staff"}

    that.mainColumnView = new Kin.Staff.InvitesView
      el: that.mainColumnSelector
      collection: friendRequests
      model: @currentUser
    that.mainColumnView.render()

    that.side1ColumnView = new Kin.Staff.InvitesSide1View
      model: @currentUser
      el: that.side1ColumnSelector
    that.side1ColumnView.render()

  renderAddClass: ()->
    addClassView = new Kin.DayCare.AddClassView
      currentUser: @currentUser
      router: @router
      model: new Kin.ProfileModel()
    addClassView.render()

  renderManageChildren: (id)->
    that = @
    @clearColumns()

    profile = new Kin.ProfileModel({_id: id})
    profile.fetch
      success: (model, response)->

        childrenList = new Kin.ChildrenCollection [], {userId: id}

        that.mainColumnView = new Kin.Class.ManageChildrenView
          el: that.mainColumnSelector
          model: model
          collection: childrenList
        that.mainColumnView.render()

        that.side1ColumnView = new Kin.Class.ManageChildrenSide1View
          model: model
          el: that.side1ColumnSelector
        that.side1ColumnView.render()

        that.side2ColumnView = new Kin.Class.ManageChildrenSide2View
          model: model
          el: that.side2ColumnSelector
        that.side2ColumnView.render()

  renderViewComment: (id)->
    that = @
    @clearColumns()
    comment = new Kin.CommentModel
      id: id
    comment.fetch
      success: (model)->
        commentId = if model.get("type") is "followup" then model.get("to_id") else id

        comments = new Kin.CommentsCollection([], {commentId: commentId})
        followups = new Kin.FollowupsCollection([], {commentId: commentId})

        that.mainColumnView = new Kin.Comment.CommentView
          model: model
          collection: comments
          followupsCollection: followups
          el: that.mainColumnSelector
        that.mainColumnView.render()

        that.side1ColumnView = new Kin.Comment.CommentSide1View
          model: model
          el: that.side1ColumnSelector
        that.side1ColumnView.render()

  renderViewNotifications: ()->
    that = @
    @clearColumns()

    notifications = new Kin.NotificationsCollection [],
      type: "alert"

    that.mainColumnView = new Kin.Profile.NotificationsView
      collection: notifications
      el: that.mainColumnSelector
      type: "alert"
    that.mainColumnView.render()

    that.side1ColumnView = new Kin.Profile.ProfileEditSide1View
      model: @currentUser
      el: that.side1ColumnSelector
    that.side1ColumnView.render()

  renderViewFeeds: ()->
    that = @
    @clearColumns()

    notifications = new Kin.NotificationsCollection [],
      type: "feed"

    that.mainColumnView = new Kin.Profile.NotificationsView
      collection: notifications
      el: that.mainColumnSelector
      type: "feed"

    that.mainColumnView.render()

    that.side1ColumnView = new Kin.Profile.ProfileEditSide1View
      model: @currentUser
      el: that.side1ColumnSelector
    that.side1ColumnView.render()

  renderViewRequests: ()->
    that = @
    @clearColumns()

    notifications = new Kin.NotificationsCollection [],
      type: "request"

    that.mainColumnView = new Kin.Profile.NotificationsView
      collection: notifications
      el: that.mainColumnSelector
      type: "request"

    that.mainColumnView.render()

    that.side1ColumnView = new Kin.Profile.ProfileEditSide1View
      model: @currentUser
      el: that.side1ColumnSelector
    that.side1ColumnView.render()

  renderDaycareSection: (sectionName, daycareId)->
    that = @
    @clearColumns()

    profile = new Kin.ProfileModel({_id: daycareId})
    profile.fetch
      success: (model, response)->

        model.setPictureSets()

        section = new Kin.SectionModel
          id: daycareId
          name: sectionName

        that.mainColumnView = new Kin.DayCare.SectionView
          model: section
          el: that.mainColumnSelector
          profile: model
        that.mainColumnView.render()

        that.side1ColumnView = new Kin.Profile.ProfileSide1View
          model: model
          el: that.side1ColumnSelector
          selectedMenuItem: "#{sectionName}-section-menu-item"
        that.side1ColumnView.render()

        that.side2ColumnView = new Kin.Profile.ProfileSide2View
          model: model
          el: that.side2ColumnSelector
          currentUser: that.currentUser
          router: that.router
        that.side2ColumnView.render()


  renderEditDaycareSection: (sectionName, daycareId)->
    that = @
    @clearColumns()

    profile = new Kin.ProfileModel({_id: daycareId})
    profile.fetch
      success: (model, response)->

        model.setPictureSets()

        section = new Kin.SectionModel
          id: daycareId
          name: sectionName

        that.mainColumnView = new Kin.DayCare.EditSectionView
          model: section
          el: that.mainColumnSelector
        that.mainColumnView.render()

        that.side1ColumnView = new Kin.Profile.ProfileEditSide1View
          model: model
          el: that.side1ColumnSelector
          selectedMenuItem: "#{sectionName}-section-menu-item"
        that.side1ColumnView.render()

        that.side2ColumnView = new Kin.Profile.ProfileSide2View
          model: model
          el: that.side2ColumnSelector
          currentUser: that.currentUser
          router: that.router
        that.side2ColumnView.render()

  clearColumns: (columns = ['main', 'side1', 'side2'])->
    (@["#{column}ColumnView"] and @["#{column}ColumnView"].remove()) for column in columns
    @goTop()

  goTop: ()->
    $("window,html,body").scrollTop(0)

  pub: ()=>
    eventName = arguments[0]
    args = Array.prototype.slice.call(arguments)
    args.shift()
    for moduleName in @modules
      if @[moduleName] and typeof @[moduleName]["trigger"] is "function"
        @[moduleName].trigger.apply @[moduleName], arguments
