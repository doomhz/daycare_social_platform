class Kin.Profile.GuideView extends Backbone.View

  model: null

  el: null

  tplUrl: '/templates/main/profile/guide.html'

  stepsToDo: [
    "added_profile_picture", "edited_profile", "added_class",
    "added_child", "invited_parent", "made_post"
  ]

  initialize: ()->
    @bind("change", @changeHandler)

  changeHandler: (attribute, value)->
    if attribute in ["flags"]
      @render()

  render: ()=>
    if not @doneAllSteps()
      that = @
      $.tmpload
        url: @tplUrl
        onLoad: (tpl)->
          $(that.el).html(tpl({profile: that.model}))
          $(that.el).removeClass("hidden")

  doneAllSteps: ()->
    doneSteps = _.intersection @model.get("flags"), @stepsToDo
    not _.difference(doneSteps, @stepsToDo).length
