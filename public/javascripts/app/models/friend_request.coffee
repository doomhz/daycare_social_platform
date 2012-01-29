class Kin.FriendRequestModel extends Backbone.Model

  defaults:
    user_id:      undefined
    from_id:      undefined
    email:        undefined
    name:         undefined
    children_ids: []
    surname:      undefined
    status:       undefined
    created_at:   undefined

  urlRoot: "/friend-requests"

  initialize: (attributes, options)->
    @id = @get("_id")

  url: ()->
    id = if @get("_id") then "/#{@get("_id")}" else ""
    "#{@urlRoot}#{id}"