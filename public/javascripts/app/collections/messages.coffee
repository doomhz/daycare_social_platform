class window.Kin.MessagesCollection extends Backbone.Collection

  model: window.Kin.MessageModel

  initialize: (models, options)->
    @url = options and options.url
    @
