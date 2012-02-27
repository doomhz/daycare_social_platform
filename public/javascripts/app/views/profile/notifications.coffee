class window.Kin.Profile.NotificationsView extends Backbone.View

  el: null

  tplUrl:
    alert: "/templates/main/profile/notifications.html"
    feed: "/templates/main/profile/feeds.html"

  itemTplUrl: "/templates/main/profile/notification_item.html"

  events:
    "click #load-more-notifications-cnt": "loadMoreNotificationsHandler"

  type: "alert"

  initialize: (options = {})->
    @type = options.type or @type
    @collection.bind("add", @addNotificationHandler)

  render: ()->
    that = @
    $.tmpload
      url: @tplUrl[@type]
      onLoad: (tpl)->
        $(that.el).html(tpl())
        $.tmpload
          url: that.itemTplUrl
          onLoad: ()->
            that.collection.fetch
              add: true

  addNotificationHandler: (model)=>
    that = @
    tpl = $.tmpload
      url: @itemTplUrl
    that.$("#notifications-list").append(tpl({item: model}))

  loadMoreNotificationsHandler: (ev)->
    ev.preventDefault()
    @collection.fetch
      add: true

  remove: ()->
    @unbind()
    $(@el).unbind().empty()
