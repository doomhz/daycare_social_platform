class window.Kin.FriendRequestsCollection extends Backbone.Collection

  model: window.Kin.FriendRequestModel

  initialize: (models, options)->
    @url = options and options.url
    @
