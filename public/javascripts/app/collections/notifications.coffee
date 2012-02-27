class window.Kin.NotificationsCollection extends Backbone.Collection

  model: window.Kin.NotificationModel

  uri: "/notifications/:type/:max_time"

  type: "alert"

  initialize: (models, options = {})->
    @url = options.url or @url
    @type = options.type or @type

  getMinTime: ()->
    minTime = new Date().getTime()
    for notification in @models
      createdAt = new Date(notification.get("created_at")).getTime()
      if createdAt < minTime
        minTime = createdAt
    minTime

  url: ()->
    "#{@uri.replace(":max_time", @getMinTime()).replace(":type", @type)}"
