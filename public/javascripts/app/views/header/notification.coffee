class window.Kin.Header.NotificationView extends Kin.Header.SubmenuView

  el: null

  tplUrl: '/templates/main/header/notification.html'
  
  indicatorId: null
  
  listId: null
  
  listItems: null
  
  submenuSelector: "ul.notification-list"

  doNotClose: false

  initialize: ({@indicatorId, @listId, @onHideUrl})->
    @bind("change", @changeHandler)
    @bind("click:window", @windowClickHandler)
    @$("a:first").bind("click", @menuButtonClickHandler)

  changeHandler: (attribute, value)->
    if attribute is @indicatorId
      @updateIndicator(value)
    if attribute is @listId
      @updateList(value)

  updateIndicator: (total)->
    $indicator = @$("##{@indicatorId}")
    $indicator.text(total)
    if total
      $indicator.removeClass("hidden")
    else
      $indicator.addClass("hidden")

  updateList: (value)->
    @listItems = value
    @render()

  render: ()->
    that = @
    $.tmpload
      url: @tplUrl
      onLoad: (tpl)->
        $el = that.$("##{that.listId}")
        $el.html(tpl(listItems: that.listItems, listId: that.listId))