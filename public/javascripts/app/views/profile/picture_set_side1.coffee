class window.Kin.Profile.PictureSetSide1View extends Kin.Profile.ProfileSide1View

  el: null

  tplUrl: '/templates/side1/profile/picture_set.html'

  selectedMenuItem: null

  initialize: ({@selectedMenuItem})->
    @model and @model.view = @
    @

  render: ()->
    that = @
    $.tmpload
      url: @tplUrl
      onLoad: (tpl)->
        profileModel = new Kin.ProfileModel({_id: that.model.get('user_id')})
        profileModel.fetch
          success: (profile)->
            $(that.el).html(tpl({pictureSet: that.model, profile: profile, selectedMenuItem: that.selectedMenuItem}))
    @

  remove: ()->
    @unbind()
    $(@el).unbind().empty()
    @