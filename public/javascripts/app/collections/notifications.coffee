class window.Kin.NotificationsCollection extends Backbone.Collection

  model: window.Kin.NotificationModel

  uri: "/notifications/:max_time"

  userId: null

  initialize: (models, options = {})->
    @url = options.url or @url

  getMinTime: ()->
    minTime = new Date().getTime()
    for notification in @models
      createdAt = new Date(notification.get("created_at")).getTime()
      if createdAt < minTime
        minTime = createdAt
    minTime

  url: ()->
    "#{@uri.replace(":max_time", @getMinTime())}"
