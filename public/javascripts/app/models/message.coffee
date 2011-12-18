class Kin.MessageModel extends Backbone.Model
  
  defaults:
    from_id:    null
    to_id:      null
    type:       "default"
    content:    ""
    unread:     false
    created_at: null
    updated_at: null
    from_user:  {}
    to_user:    {}
  
  urlRoot: "/messages"

  initialize: (attributes, options)->
    @id = @get("_id")
  
  url: ()->
    id = if @get("_id") then "/#{@get("_id")}" else ""
    "#{@urlRoot}#{id}"