class Kin.DayCare.AddClassView extends Kin.DoomWindowsView

  el: null

  tplUrl: '/templates/main/day_care/add_class.html'

  currentUser: null

  router: null

  windowOptions:
    wrapperId: "add-class-win"
    closeOnSideClick: false
    headerButtons: false
    buttons:
      "save": "save"

  initialize: ({@currentUser, @router})->
    super()

  render: ()->
    that = @
    $.tmpload
      url: @tplUrl
      onLoad: (tpl)=>
        profile = new Kin.ProfileModel()
        @open tpl({profile: profile})
        @$("#add-class-form").bind "submit", @addClass

  onButtonClick: (btType, $win)=>
    if btType is "save"
      @$("#add-class-form").submit()

  addClass: (ev)=>
    ev.preventDefault()
    that = @
    $form = @$("#add-class-form")
    formData = $form.serialize()
    profileModel = new Kin.ProfileModel()
    profileModel.save null,
      data: formData
      success: (model, response)->
        name = $form.find("input[name='name']").val()
        $.jGrowl("#{name} class was successfully created")
        that.currentUser.fetch()
        that.close()
        that.router.navigate("profiles/view/#{response._id}", true)
        that.remove()
      error: ()->
        $.jGrowl("The class could not be created :( Please try again.")

  remove: ()->
    @unbind()
    $(@el).unbind().empty()
