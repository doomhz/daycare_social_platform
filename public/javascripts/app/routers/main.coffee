class window.Kin.MainRouter extends Backbone.Router

  app: null

  routes:
    ''                               : 'root'
    'day-cares'                      : 'dayCares'
    'day-cares/view/:id'             : 'viewDayCare'
    'day-cares/view/gallery/:id'     : 'viewDayCareGallery'
    'day-cares/edit/:id'             : 'editDayCare'
    'day-cares/view/picture-set/:id' : 'viewDayCarePictureSet'
    'messages/write'                 : 'writeMessage'
    'messages/write/:id'             : 'writeMessage'
    'messages/inbox'                 : 'viewInboxMessages'
    'messages/draft'                 : 'viewDraftMessages'
    'messages/sent'                  : 'viewSentMessages'
    'messages/trash'                 : 'viewTrashMessages'

  initialize: ({@app})->

  root: ()->
    @navigate('day-cares', true)

  dayCares: ()->
    @app.renderDaycares()

  viewDayCare: (id)->
    @app.renderViewDaycare(id)

  viewDayCareGallery: (id)->
    @app.renderViewDayCareGallery(id)

  editDayCare: (id)->
    @app.renderEditDayCare(id)

  viewDayCarePictureSet: (id)->
    @app.renderViewDayCarePictureSet(id)

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
