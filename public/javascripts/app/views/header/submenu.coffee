class Kin.Header.SubmenuView extends Backbone.View

  el: null
  
  submenuSelector: "ul.submenu"

  doNotClose: false
  
  onShow: null
  
  initialize: ()->
    @bind("click:window", @windowClickHandler)
    @$("a:first").bind("click", @menuButtonClickHandler)

  menuButtonClickHandler: (ev)=>
    ev.preventDefault()
    if @$(@submenuSelector).hasClass("hidden")
      @selectMenuItem()
      @showSubmenu()
      @doNotClose = true

  windowClickHandler: (ev)->
    if not @doNotClose
      @deselectMenuItem()
      @hideSubmenu()
    else
      @doNotClose = false
  
  showSubmenu: ()->
    @$(@submenuSelector).removeClass("hidden")
    if @onShowUrl
      @onShow()
  
  onShow: ()->
    $.ajax
      type: "PUT"
      url: @onShowUrl
  
  hideSubmenu: ()->
    @$(@submenuSelector).addClass("hidden")
  
  selectMenuItem: ()->
    $(@el).addClass("selected")
  
  deselectMenuItem: ()->
    $(@el).removeClass("selected")