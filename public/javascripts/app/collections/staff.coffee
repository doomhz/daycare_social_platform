class window.Kin.StaffCollection extends Backbone.Collection

  model: window.Kin.StaffModel

  uri: "/staff/:userId"

  @userId: null

  initialize: (models, options = {})->
    @url = options.url or @url
    @userId = options.userId or @userId
    @

  url: ()->
    @uri.replace(/:userId/g, @userId)
