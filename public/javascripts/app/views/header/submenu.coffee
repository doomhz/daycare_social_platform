class Kin.Header.SubmenuView extends Backbone.View

  el: null
  
  submenuSelector: "ul.submenu"

  events:
    "click a:first": "menuButtonClickHandler"
  
  doNotClose: false
  
  initialize: ()->
    @bind("click:window", @windowClickHandler)

  menuButtonClickHandler: (ev)->
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
  
  hideSubmenu: ()->
    @$(@submenuSelector).addClass("hidden")
  
  selectMenuItem: ()->
    $(@el).addClass("selected")
  
  deselectMenuItem: ()->
    $(@el).removeClass("selected")