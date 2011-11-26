class Kin.DayCare.ProfileGeneralInfoView extends Backbone.View
  
  tplUrl: '/templates/main/day_care/profile_general_info.html'
  
  events:
    'click #profile-general-info': 'goToEditProfile'

  router: null

  initialize: ({@router})->
  
  render: ()->
    that = @
    $.tmpload
      url: @tplUrl
      onLoad: (tpl)->
        $el = $(that.el)
        $el.html(tpl({dayCare: that.model}))
  
  @
  
  remove: ()->
    $el = $(@el)
    @unbind()
    $el.unbind()
    @
  
  goToEditProfile: (ev)->
    editProfileUrl = $(ev.currentTarget).data('edit-url')
    @router.navigate(editProfileUrl, true)