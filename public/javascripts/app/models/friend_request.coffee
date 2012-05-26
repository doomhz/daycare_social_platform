class Kin.FriendRequestModel extends Backbone.Model

  defaults:
    user_id:      undefined
    from_id:      undefined
    email:        undefined
    name:         undefined
    children_ids: []
    classes_ids:  []
    surname:      undefined
    status:       undefined
    created_at:   undefined

  urlRoot: "/friend-request"

  sendRequestUrl: "/friend-request/send/:id"

  cancelRequestUrl: "/friend-request/cancel/:id"

  activateRequestUrl: "/friend-request/activate/:id"

  initialize: (attributes, options)->
    @id = @get("_id")

  send: (options = {})->
    options.url = @sendRequestUrl.replace(":id", @id)
    @save null, options

  cancel: (options = {})->
    options.url = @cancelRequestUrl.replace(":id", @id)
    @save null, options

  activate: (options = {})->
    options.url = @activateRequestUrl.replace(":id", @id)
    @save null, options

  url: ()->
    id = if @get("_id") then "/#{@get("_id")}" else ""
    "#{@urlRoot}#{id}"