class window.Kin.ClassesCollection extends Backbone.Collection

  model: window.Kin.ClassModel

  uri: "/classes/:masterId"

  @masterId: null

  initialize: (models, options = {})->
    @url = options.url or @url
    @masterId = options.masterId or @masterId
    @

  url: ()->
    @uri.replace(/:masterId/g, @masterId)
