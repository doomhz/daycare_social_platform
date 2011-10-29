class window.Kin.DayCareCollection extends Backbone.Collection

  model: window.Kin.DayCareModel

  initialize: (models, options)->
    @url = options and options.url
    @
