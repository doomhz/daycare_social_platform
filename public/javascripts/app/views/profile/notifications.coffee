class window.Kin.Profile.NotificationsView extends Backbone.View

  el: null

  tplUrl:
    alert: "/templates/main/profile/notifications.html"
    feed: "/templates/main/profile/feeds.html"
    request: "/templates/main/profile/requests.html"

  itemTplUrl: "/templates/main/profile/notification_item.html"
  dateTplUrl: "/templates/main/profile/notification_date.html"

  events:
    "click #load-more-notifications-cnt": "loadMoreNotificationsHandler"

  type: "alert"

  lastDisplayedDay: null

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
            $.tmpload
              url: that.dateTplUrl
              onLoad: ()->
                that.collection.fetch
                  add: true

  addNotificationHandler: (model)=>
    that = @
    itemTpl = $.tmpload
      url: @itemTplUrl
    notificationDate = new Date(model.get("created_at"))
    if @isAnotherDay(notificationDate)
      @renderDate(notificationDate)
    that.$("#notifications-list").append(itemTpl({item: model}))

  loadMoreNotificationsHandler: (ev)->
    ev.preventDefault()
    @collection.fetch
      add: true

  isAnotherDay: (notificationDate)->
    @parseDate(notificationDate) isnt @lastDisplayedDay

  renderDate: (notificationDate)->
    that = @
    dateTpl = $.tmpload
      url: @dateTplUrl
    that.$("#notifications-list").append(dateTpl({date: notificationDate}))
    @lastDisplayedDay = @parseDate(notificationDate)

  parseDate: (date)->
    "#{date.getYear()}#{date.getMonth()}#{date.getDay()}"

  remove: ()->
    @unbind()
    $(@el).unbind().empty()
