class window.Kin.FriendRequestsCollection extends Backbone.Collection

  model: window.Kin.FriendRequestModel

  initialize: (models, options)->
    @url = options and options.url
    @

  comparator: (friendRequest)->
    return 1 if friendRequest.get("status") is "canceled"
    return -1