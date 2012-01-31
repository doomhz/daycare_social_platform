class window.Kin.ParentsCollection extends Backbone.Collection

  model: window.Kin.ParentModel

  uri: "/parents/:userId"

  @userId: null

  initialize: (models, options = {})->
    @url = options.url or @url
    @userId = options.userId or @userId
    @

  url: ()->
    @uri.replace(/:userId/g, @userId)

  filterByChildId: (childId)->
    @filter (parent)->
      $.inArray(childId, parent.get("children_ids")) > -1
