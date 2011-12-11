class Kin.WindowView extends Backbone.View
  
  el: window
  
  events:
    "click": "clickHandler"
  
  eventDelegates: []
  
  clickHandler: (ev)->
    @announceDelegates(ev)
  
  announceDelegates: (ev)->
    for eventDelegate in @eventDelegates
      eventDelegate.trigger("click:window", ev)
  
  addEventDelegate: (delegate)->
    @eventDelegates.push(delegate)