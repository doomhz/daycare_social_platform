class window.Kin.ProfileCollection extends Backbone.Collection

  model: window.Kin.ProfileModel

  initialize: (models, options)->
    @url = options and options.url
    @
