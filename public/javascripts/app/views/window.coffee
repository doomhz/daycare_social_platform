class Kin.WindowView extends Backbone.View
  
  el: window
  
  events:
    "click": "clickHandler"
  
  delegates: []
  
  clickHandler: (ev)->
    @announceDelegates(ev)
  
  announceDelegates: (ev)->
    for eventDelegate in @delegates
      eventDelegate.trigger("click:window", ev)
  
  addDelegate: (delegate)->
    @delegates.push(delegate)