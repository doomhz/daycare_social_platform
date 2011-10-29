$.tmpload url: '/templates/main/day_care/list_item.html'

$ ()->
  window.Kin.router = new window.Kin.MainRouter()
  Backbone.history.start({pushState: false})
