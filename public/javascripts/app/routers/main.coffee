class window.Kin.MainRouter extends Backbone.Router

  routes:
    ''                               : 'root'
    'day-cares'                      : 'dayCares'
    'day-cares/view/:id'             : 'viewDayCare'
    'day-cares/view/gallery/:id'     : 'viewDayCareGallery'
    'day-cares/edit/:id'             : 'editDayCare'
    'day-cares/view/picture-set/:id' : 'viewDayCarePictureSet'
    'messages/write'                 : 'writeMessage'
    'messages/inbox'                 : 'viewInboxMessages'
    'messages/draft'                 : 'viewDraftMessages'
    'messages/sent'                  : 'viewSentMessages'
    'messages/trash'                 : 'viewTrashMessages'

  mainColumnView: null

  side1ColumnView: null

  initialize: ()->
    @loadCurrentUser()
    @loadWindow()
    @loadHeaderMenu()

  root: ()->
    @clearColumns()
    @navigate('day-cares', true)

  dayCares: ()->
    @clearColumns()
    @mainColumnView = new window.Kin.DayCare.ListView
      collection: new window.Kin.DayCareCollection([], {url: '/day-cares'})
      el: '#main-column'
    @mainColumnView.render()

  viewDayCare: (id)->
    that = @
    @clearColumns()
    dayCare = new window.Kin.DayCareModel({_id: id})
    dayCare.fetch
      success: (model, response)->

        model.setPictureSets()

        that.mainColumnView = new window.Kin.DayCare.ProfileView
          model: model
          el: '#main-column'
          router: that
          currentUser: Kin.currentUser
        that.mainColumnView.render()

        that.side1ColumnView = new window.Kin.DayCare.ProfileSide1View
          model: model
          el: '#side-column1'
          currentUser: Kin.currentUser
          selectedMenuItem: "wall-menu-item"
        that.side1ColumnView.render()

  viewDayCareGallery: (id)->
    that = @
    @clearColumns()
    dayCare = new window.Kin.DayCareModel({_id: id})
    dayCare.fetch
      success: (model, response)->

        model.setPictureSets()

        that.mainColumnView = new window.Kin.DayCare.ProfileGalleryView
          model: model
          el: '#main-column'
          router: that
          currentUser: Kin.currentUser
        that.mainColumnView.render()

        that.side1ColumnView = new window.Kin.DayCare.ProfileSide1View
          model: model
          el: '#side-column1'
          selectedMenuItem: 'gallery-menu-item'
          currentUser: Kin.currentUser
        that.side1ColumnView.render()

  editDayCare: (id)->
    that = @
    @clearColumns()
    dayCare = new window.Kin.DayCareModel({_id: id})
    dayCare.fetch
      success: (model, response)->

        mapCenterLat = model.get('location').lat
        mapCenterLng = model.get('location').lng

        that.mainColumnView = new window.Kin.DayCare.ProfileEditView
          model: model
          el: '#main-column'
          maps: new window.Kin.GoogleMapsView
            id: '#profile-address-maps'
            mapsOptions:
              zoom: 15
              mapTypeId: 'google.maps.MapTypeId.ROADMAP'
              center: "new google.maps.LatLng(#{mapCenterLat}, #{mapCenterLng})"
        that.mainColumnView.render()

        that.side1ColumnView = new window.Kin.DayCare.ProfileEditSide1View
          model: model
          el: '#side-column1'
        that.side1ColumnView.render()

  viewDayCarePictureSet: (id)->
    that = @
    @clearColumns()
    pictureSet = new window.Kin.PictureSetModel({_id: id})
    pictureSet.fetch
      success: (model, response)->

        that.mainColumnView = new window.Kin.DayCare.PictureSetView
          model: model
          el: '#main-column'
          currentUser: Kin.currentUser
        that.mainColumnView.render()

        that.side1ColumnView = new window.Kin.DayCare.PictureSetSide1View
          model: model
          el: '#side-column1'
          currentUser: Kin.currentUser
        that.side1ColumnView.render()

  writeMessage: ()->
    that = @
    @clearColumns()
    
    usersCollection = new Kin.UsersCollection

    that.mainColumnView = new window.Kin.Messages.WriteView
      el: '#main-column'
      collection: usersCollection
    that.mainColumnView.render()

    that.side1ColumnView = new window.Kin.Messages.InboxSide1View
      el: '#side-column1'
      selectedMenuItem: "write-menu-item"
    that.side1ColumnView.render()

  viewInboxMessages: ()->
    that = @
    @clearColumns()

    messagesCollection = new window.Kin.MessagesCollection [],
      url: "/messages/default"

    that.mainColumnView = new window.Kin.Messages.InboxView
      el: '#main-column'
      collection: messagesCollection
    that.mainColumnView.render()

    that.side1ColumnView = new window.Kin.Messages.InboxSide1View
      el: '#side-column1'
      selectedMenuItem: "inbox-menu-item"
    that.side1ColumnView.render()

  viewDraftMessages: ()->
    that = @
    @clearColumns()

    messagesCollection = new window.Kin.MessagesCollection [],
      url: "/messages/draft"

    that.mainColumnView = new window.Kin.Messages.DraftView
      el: '#main-column'
      collection: messagesCollection
    that.mainColumnView.render()

    that.side1ColumnView = new window.Kin.Messages.DraftSide1View
      el: '#side-column1'
      selectedMenuItem: "draft-menu-item"
    that.side1ColumnView.render()

  viewSentMessages: ()->
    that = @
    @clearColumns()

    messagesCollection = new window.Kin.MessagesCollection [],
      url: "/messages/sent"

    that.mainColumnView = new window.Kin.Messages.SentView
      el: '#main-column'
      collection: messagesCollection
    that.mainColumnView.render()

    that.side1ColumnView = new window.Kin.Messages.SentSide1View
      el: '#side-column1'
      selectedMenuItem: "sent-menu-item"
    that.side1ColumnView.render()

  viewTrashMessages: ()->
    that = @
    @clearColumns()
    
    messagesCollection = new window.Kin.MessagesCollection [],
      url: "/messages/deleted"

    that.mainColumnView = new window.Kin.Messages.TrashView
      el: '#main-column'
      collection: messagesCollection
    that.mainColumnView.render()

    that.side1ColumnView = new window.Kin.Messages.TrashSide1View
      el: '#side-column1'
      selectedMenuItem: "trash-menu-item"
    that.side1ColumnView.render()

  clearColumns: (columns = ['main', 'side1'])->
    (@["#{column}ColumnView"] and @["#{column}ColumnView"].remove()) for column in columns
  
  loadCurrentUser: ()->
    Kin.currentUser = new Kin.UserModel()
    Kin.currentUser.fetch
      success: (model)->
        if not model.get('_id')
          window.location = '/login'

  loadWindow: ()->
    Kin.window = new Kin.WindowView()

  loadHeaderMenu: ()->
    headerSettingsSubmenu = new Kin.Header.SubmenuView
      el: "header #account-bt"
    Kin.window.addEventDelegate(headerSettingsSubmenu)


