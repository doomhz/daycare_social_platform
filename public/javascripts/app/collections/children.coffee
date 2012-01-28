class window.Kin.ChildrenCollection extends Backbone.Collection

  model: window.Kin.ChildModel

  initialize: (models, options)->
    @url = options and options.url
    @
