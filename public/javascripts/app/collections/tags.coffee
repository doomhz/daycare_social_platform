class window.Kin.TagsCollection extends Backbone.Collection

  model: window.Kin.TagModel

  uri: "/tags/:type"

  type: null

  initialize: (models, options = {})->
    @url = options.url or @url
    @type = options.type or @type
    @

  url: ()->
    @uri.replace(/:type/g, @type)
