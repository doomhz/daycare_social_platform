class window.Kin.Profile.PictureSetSide1View extends Kin.Profile.ProfileSide1View

  el: null

  tplUrl: '/templates/side1/profile/picture_set.html'

  selectedMenuItem: null

  profileModel: null

  initialize: ({@selectedMenuItem})->
    @model and @model.view = @
    @

  render: ()->
    that = @
    $.tmpload
      url: @tplUrl
      onLoad: (tpl)->
        that.profileModel = new Kin.ProfileModel({_id: that.model.get('user_id')})
        that.profileModel.fetch
          success: (profile)->
            $(that.el).html(tpl({pictureSet: that.model, profile: profile, selectedMenuItem: that.selectedMenuItem}))

  quickMessageHandler: (ev)->
    ev.preventDefault()
    @showQuickMessageWindow(@profileModel)

  remove: ()->
    @unbind()
    $(@el).unbind().empty()
    @