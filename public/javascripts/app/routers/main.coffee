class window.Kin.MainRouter extends Backbone.Router

  app: null

  routes:
    ''                              : 'root'
    'profiles/view/:id'             : 'viewProfile'
    'profiles/view/gallery/:id'     : 'viewProfileGallery'
    'profiles/edit/:id'             : 'editProfile'
    'profiles/view/picture-set/:id' : 'viewProfilePictureSet'
    'profiles/view/our-family/:id'  : 'viewOurFamily'
    'messages/write'                : 'writeMessage'
    'messages/write/:id'            : 'writeMessage'
    'messages/inbox'                : 'viewInboxMessages'
    'messages/draft'                : 'viewDraftMessages'
    'messages/sent'                 : 'viewSentMessages'
    'messages/trash'                : 'viewTrashMessages'
    'invite-parents'                : 'inviteParents'
    'invite-staff'                  : 'inviteStaff'
    'add-class'                     : 'addClass'
    'manage-children/:id'           : 'manageChildren'
    'comments/view/:id'             : 'viewComment'
    'day-cares'                     : 'dayCares'
    'day-care/:section/:id'         : 'viewDaycareSection'
    'day-care/edit/:section/:id'    : 'editDaycareSection'

  initialize: ({@app})->

  root: ()->
    @navigate('day-cares', true)

  dayCares: ()->
    @app.renderDaycares()

  viewProfile: (id)->
    @app.renderViewProfile(id)

  viewProfileGallery: (id)->
    @app.renderViewProfileGallery(id)

  editProfile: (id)->
    @app.renderEditProfile(id)

  viewProfilePictureSet: (id)->
    @app.renderViewProfilePictureSet(id)

  viewOurFamily: (id)->
    @app.renderViewOurFamily(id)

  writeMessage: (id)->
    @app.renderWriteMessage(id)

  viewInboxMessages: ()->
    @app.renderViewInboxMessages()

  viewDraftMessages: ()->
    @app.renderViewDraftMessages()

  viewSentMessages: ()->
    @app.renderViewSentMessages()

  viewTrashMessages: ()->
    @app.renderViewTrashMessages()

  inviteParents: ()->
    @app.renderInviteParents()

  inviteStaff: ()->
    @app.renderInviteStaff()

  addClass: ()->
    @app.renderAddClass()

  manageChildren: (id)->
    @app.renderManageChildren(id)
  
  viewComment: (id)->
    @app.renderViewComment(id)
  
  viewDaycareSection: (section, id)->
    @app.renderDaycareSection(section, id)

  editDaycareSection: (section, id)->
    @app.renderEditDaycareSection(section, id)
    
