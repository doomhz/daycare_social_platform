class window.Kin.DayCare.PictureSetSide1View extends Backbone.View

  el: null

  tplUrl: '/templates/side1/day_care/profile.html'

  initialize: ()->
    @model and @model.view = @
    @

  render: ()->
    that = @
    $.tmpload
      url: @tplUrl
      onLoad: (tpl)->
        dayCareModel = new Kin.DayCareModel({_id: that.model.get('daycare_id')})
        dayCareModel.fetch
          success: (dayCare)->
            $(that.el).html(tpl({pictureSet: that.model, dayCare: dayCare}))
    @

  remove: ()->
    @unbind()
    $(@el).unbind().empty()
    @