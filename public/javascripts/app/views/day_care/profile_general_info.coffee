class Kin.DayCare.ProfileGeneralInfoView extends Backbone.View
  
  tplUrl: '/templates/main/day_care/profile_general_info.html'

  router: null
  
  currentUser: null

  initialize: ({@router, @currentUser})->
  
  render: ()->
    that = @
    $.tmpload
      url: @tplUrl
      onLoad: (tpl)->
        $el = $(that.el)
        canEdit = that.currentUser.canEditDayCare(that.model.get('_id'))
        $el.html(tpl({dayCare: that.model, canEdit: canEdit}))
        if canEdit
          that.$("#profile-general-info").bind("click", that.goToEditProfile)
  
  @
  
  remove: ()->
    $el = $(@el)
    @unbind()
    $el.unbind()
    @
  
  goToEditProfile: (ev)=>
    editProfileUrl = $(ev.currentTarget).data('edit-url')
    @router.navigate(editProfileUrl, true)