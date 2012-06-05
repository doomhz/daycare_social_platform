class Kin.Profile.GuideView extends Backbone.View

  model: null

  el: null

  tplUrl: '/templates/main/profile/guide.html'

  initialize: ()->
    @bind("change", @changeHandler)

  changeHandler: (attribute, value)->
    if attribute in ["friends"]
      @render()

  render: ()=>
    that = @
    $.tmpload
      url: @tplUrl
      onLoad: (tpl)->
        $(that.el).html(tpl({profile: that.model}))
