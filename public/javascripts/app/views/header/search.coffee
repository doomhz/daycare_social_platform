class Kin.Header.SearchView extends Backbone.View

  el: null

  events:
    "mouseenter": "mouseEnterHandler"
    "mouseleave": "mouseLeaveHandler"
  
  initialize: ()->
  
  mouseEnterHandler: ()->
    @$("#search-menu").removeClass("invisible")

  mouseLeaveHandler: ()->
    @$("#search-menu").addClass("invisible")
