class window.Kin.UsersCollection extends Backbone.Collection

  model: window.Kin.UserModel

  url: "/profiles"

  initialize: (models, options)->
