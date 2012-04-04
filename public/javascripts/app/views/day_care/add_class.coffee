class Kin.DayCare.AddClassView extends Kin.DoomWindowsView

  el: null

  tplUrl: '/templates/main/day_care/add_class.html'

  currentUser: null

  router: null

  windowOptions:
    wrapperId: "add-class-win"
    closeOnSideClick: false
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
        @$("#add-another-staff").bind "click", @addAnotherStaffForm

  onButtonClick: (btType, $win)=>
    if btType is "save"
      @$("#add-class-form").submit()
    if btType is "close"
      @close()
      @router.goBack()

  addClass: (ev)=>
    ev.preventDefault()
    that = @
    $form = @$("#add-class-form")
    formData = $form.serialize()
    profileModel = new Kin.ProfileModel()
    profileModel.save null,
      data: formData
      success: (model, response)->
        that.classId = response._id
        name = $form.find("input[name='name']").val()
        $.jGrowl("#{name} class was successfully created")
        that.currentUser.fetch()
        that.submitStaffForms()
        that.close()
        that.router.navigate("profiles/view/#{that.classId}", true)
        that.remove()
      error: ()->
        $.jGrowl("The class could not be created :( Please try again.")

  submitStaffForms: ()->
    that = @
    @$(".add-staff-form").each (index, form)->
      staffData = that.getStaffFormData($(form))
      if staffData
        that.saveStaffFriendRequest(staffData)

  getStaffFormData: ($form)->
    data =
      gender: $form.find("select[name='staffs-gender']").val()
      name: $form.find("input[name='staffs-name']").val()
      surname: $form.find("input[name='staffs-surname']").val()
      email: $form.find("input[name='staffs-email']").val()
      classes_ids: [@classId]
      type: "staff"
    if data.name and data.surname and data.email
      return data
    else
      false

  saveStaffFriendRequest: (data)->
    friendRequestModel = new Kin.FriendRequestModel(data)
    friendRequestModel.save()

  addAnotherStaffForm: (ev)=>
    ev.preventDefault()
    $addStaffForm = @$(".add-staff-form:first").clone()
    $addStaffForm.find("input").val("")
    @$("#add-staff-form-cnt").append($addStaffForm)

  remove: ()->
    @unbind()
    $(@el).unbind().empty()
