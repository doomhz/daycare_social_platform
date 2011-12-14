class Kin.MessageModel extends Backbone.Model
  
  defaults:
    from_id:    null
    to_id:      null
    type:       "default"
    content:    ""
    created_at: null
    updated_at: null
    from_user:  null
  
  urlRoot: "/messages"
