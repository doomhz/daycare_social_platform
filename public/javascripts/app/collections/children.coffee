class window.Kin.ChildrenCollection extends Backbone.Collection

  model: window.Kin.ChildModel

  uri: "/children/:userId"

  userId: null

  initialize: (models, options = {})->
    @url = options.url or @url
    @userId = options.userId or @userId
    @

  url: ()->
    @uri.replace(/:userId/g, @userId)

  filterByClassId: (classId)->
    @filter (child)->
      child.get("user_id") == classId