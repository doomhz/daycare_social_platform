class window.Kin.UsersCollection extends Backbone.Collection

  model: window.Kin.UserModel
  
  url: "/users"

  initialize: (models, options)->
