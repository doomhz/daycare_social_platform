class window.Kin.DayCare.PictureSetSide1View extends Kin.DayCare.ProfileSide1View

  el: null

  tplUrl: '/templates/side1/day_care/profile.html'

  selectedMenuItem: null

  initialize: ({@selectedMenuItem})->
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
            $(that.el).html(tpl({pictureSet: that.model, dayCare: dayCare, selectedMenuItem: that.selectedMenuItem}))
    @

  remove: ()->
    @unbind()
    $(@el).unbind().empty()
    @