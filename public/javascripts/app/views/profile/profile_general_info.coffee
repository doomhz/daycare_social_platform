class Kin.Profile.ProfileGeneralInfoView extends Backbone.View

  tplUrl:
    daycare: '/templates/main/day_care/profile_general_info.html'
    parent:  '/templates/main/parent/profile_general_info.html'

  router: null

  currentUser: null

  initialize: ({@router, @currentUser})->

  render: ()->
    that = @
    $.tmpload
      url: @tplUrl[@model.get("type")]
      onLoad: (tpl)->
        $el = $(that.el)
        canEdit = that.currentUser.canEditProfile(that.model.get('_id'))
        $el.html(tpl({profile: that.model, canEdit: canEdit}))
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