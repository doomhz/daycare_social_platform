class Kin.FriendRequestModel extends Backbone.Model

  defaults:
    from_id: null
    email: null
    name: null
    surname: null
    status: null
    created_at: null

  urlRoot: "/friend-requests"

  initialize: (attributes, options)->
    @id = @get("_id")

  url: ()->
    id = if @get("_id") then "/#{@get("_id")}" else ""
    "#{@urlRoot}#{id}"