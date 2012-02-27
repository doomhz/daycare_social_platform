class window.Kin.Profile.NotificationsView extends Backbone.View

  el: null

  tplUrl: "/templates/main/profile/notifications.html"

  itemTplUrl: "/templates/main/profile/notification_item.html"

  events:
    "click #load-more-notifications-cnt": "loadMoreNotificationsHandler"

  initialize: ()->
    @collection.bind("add", @addNotificationHandler)

  render: ()->
    that = @
    $.tmpload
      url: @tplUrl
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
