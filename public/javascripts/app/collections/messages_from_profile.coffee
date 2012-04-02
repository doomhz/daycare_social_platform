class window.Kin.MessagesFromProfileCollection extends Kin.MessagesCollection

  uri: "/messages/from/:user_id"

  userId: null

  initialize: (models, options = {})->
    @userId = options.userId
    @uri    = options.uri or @uri

  markMessagesAsRead: ()->
    for message in @models
      if message.get("unread")
        message.set({"unread": false})
        message.save()

  url: ()->
    @uri.replace(/:user_id/, @userId or "")