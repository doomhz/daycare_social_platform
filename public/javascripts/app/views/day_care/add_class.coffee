class Kin.DayCare.AddClassView extends Backbone.View

  el: null

  tplUrl: '/templates/main/day_care/add_class.html'

  events:
    "submit #add-class-form" : "addClass"

  currentUser: null

  initialize: ({@currentUser})->
    super()

  render: ()->
    that = @
    $.tmpload
      url: @tplUrl
      onLoad: (tpl)->
        profile = new Kin.ProfileModel()
        $(that.el).html(tpl({profile: profile}))

  addClass: (ev)->
    ev.preventDefault()
    that = @
    $form = $(ev.target)
    formData = $form.serialize()
    profileModel = new Kin.ProfileModel()
    profileModel.save null,
      data: formData
      success: ()->
        name = $form.find("input[name='name']").val()
        $.jGrowl("#{name} class was successfully created")
        that.render()
        that.currentUser.fetch()
      error: ()->
        $.jGrowl("The class could not be created :( Please try again.")

  remove: ()->
    @unbind()
    $(@el).unbind().empty()