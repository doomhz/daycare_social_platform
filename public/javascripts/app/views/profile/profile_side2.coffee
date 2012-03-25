class Kin.Profile.ProfileSide2View extends Backbone.View

  tplUrl:
    daycare: '/templates/side2/day_care/profile.html'
    parent:  '/templates/side2/parent/profile.html'
    staff:  '/templates/side2/staff/profile.html'
    class:  '/templates/side2/class/profile.html'

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

  remove: ()->
    $el = $(@el)
    @unbind()
    $el.unbind()
    $el.empty()

  goToEditProfile: (ev)=>
    editProfileUrl = $(ev.currentTarget).data('edit-url')
    @router.navigate(editProfileUrl, true)