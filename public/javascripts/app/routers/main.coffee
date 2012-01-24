class window.Kin.MainRouter extends Backbone.Router

  app: null

  routes:
    ''                              : 'root'
    'day-cares'                     : 'dayCares'
    'profiles/view/:id'             : 'viewProfile'
    'profiles/view/gallery/:id'     : 'viewProfileGallery'
    'profiles/edit/:id'             : 'editProfile'
    'profiles/view/picture-set/:id' : 'viewProfilePictureSet'
    'messages/write'                : 'writeMessage'
    'messages/write/:id'            : 'writeMessage'
    'messages/inbox'                : 'viewInboxMessages'
    'messages/draft'                : 'viewDraftMessages'
    'messages/sent'                 : 'viewSentMessages'
    'messages/trash'                : 'viewTrashMessages'
    'invite-parents'                : 'inviteParents'
    'add-class'                     : 'addClass'

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

  addClass: ()->
    @app.renderAddClass()
