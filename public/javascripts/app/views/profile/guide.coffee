class Kin.Profile.GuideView extends Backbone.View

  model: null

  el: null

  tplUrl: '/templates/main/profile/guide.html'

  stepsToDo:
    daycare: [
      "added_profile_picture", "edited_profile",
      "added_class", "added_child", "invited_parent",
      "made_post"
    ]
    parent: [
      "added_profile_picture", "edited_profile",
      "made_post"
    ]
    staff: [
      "added_profile_picture", "edited_profile",
      "made_post"
    ]

  initialize: ()->
    @bind "profile:flag", @changeHandler

  changeHandler: (attribute, value)=>
    @render(true)

  render: (renderOnDone = false)=>
    if (@doneAllSteps() and renderOnDone) or not @doneAllSteps()
      that = @
      $.tmpload
        url: @tplUrl
        onLoad: (tpl)->
          $(that.el).html(tpl({profile: that.model}))
          $(that.el).removeClass("hidden")

  doneAllSteps: ()->
    doneSteps = _.intersection @model.get("flags"), @stepsToDo[@model.get("type")]
    not _.difference(@stepsToDo[@model.get("type")], doneSteps).length
