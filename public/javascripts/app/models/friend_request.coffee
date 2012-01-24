class Kin.FriendRequestModel extends Backbone.Model

  defaults:
    user_id:    null
    from_id:    null
    email:      null
    name:       null
    class_ids:  []
    surname:    null
    status:     null
    created_at: null

  urlRoot: "/friend-requests"

  initialize: (attributes, options)->
    @id = @get("_id")

  url: ()->
    id = if @get("_id") then "/#{@get("_id")}" else ""
    "#{@urlRoot}#{id}"