class Kin.Parent.InvitesView extends Backbone.View

  el: null

  model: null

  tplUrl: '/templates/main/parent/invites.html'
  quickAddChildTplUrl: "/templates/main/parent/quick_add_child.html"

  events:
    "submit #send-invite-form"    : "sendInvite"
    "click #open-add-child-box-bt": "openAddChildBoxHandler"

  cachedFormData: null

  initialize: ()->

  render: (afterRender)->
    that = @
    $.tmpload
      url: @tplUrl
      onLoad: (tpl)->
        children = new Kin.ChildrenCollection([], {userId: that.model.get("_id")})
        children.fetch
          success: ()->
            $(that.el).html(tpl({profile: that.model, classes: that.model.get("daycare_friends"), children: children.models}))
            that.$(".chzn-select").chosen()
            $.isFunction(afterRender) and afterRender()

            that.friendRequestsList = new Kin.Parent.FriendRequestsListView
              el: that.$("#friend-requests-list")
              collection: that.collection
              model: that.model
            that.renderFriendRequestsList()

  renderFriendRequestsList: ()->
    that = @
    that.friendRequestsList.collection.fetch
      success: ()->
        that.friendRequestsList.render()

  sendInvite: (ev)->
    ev.preventDefault()
    that = @
    $form = $(ev.target)

    mothersData = @getFormData($form, "mother")
    fathersData = @getFormData($form, "father")

    if mothersData and fathersData and mothersData.email is fathersData.email
      dAlert("Please assign different e-mail addresses for both parents.")
      return false
    if mothersData
      if @isUniqueEmail(mothersData.email)
        @saveFriendRequest(mothersData)
      else
        dAlert("An invite has already been sent to #{mothersData.email}.<br />Please choose another one.")
    if fathersData
      if @isUniqueEmail(fathersData.email)
        @saveFriendRequest(fathersData)
      else
        dAlert("An invite has already been sent to #{fathersData.email}.<br />Please choose another one.")

  saveFriendRequest: (data)->
    friendRequestModel = new Kin.FriendRequestModel(data)
    friendRequestModel.save null,
      success: @onFormSaveSuccess
      error: @onFormSaveError

  onFormSaveSuccess: ()=>
    $.jGrowl("Invite successfully sent")
    @render()

  onFormSaveError: ()=>
    $.jGrowl("Invite could not be sent :( Please try again.")

  getFormData: ($form, fieldPrefix)->
    data =
      name: $form.find("input[name='#{fieldPrefix}s-name']").val()
      surname: $form.find("input[name='#{fieldPrefix}s-surname']").val()
      email: $form.find("input[name='#{fieldPrefix}s-email']").val()
      children_ids: $form.find("select[name='children_ids']").val()
      gender: if fieldPrefix is "mother" then "female" else "male"
    if data.name and data.surname and data.email
      return data
    else
      false

  isUniqueEmail: (email)->
    sameEmailInvites = @collection.find (invite)->
      invite.get("email") is email
    not sameEmailInvites

  openAddChildBoxHandler: (ev)->
    ev.preventDefault()
    @showQuickAddChildWindow()

  showQuickAddChildWindow: ()->
    that = @
    $.tmpload
      url: @quickAddChildTplUrl
      onLoad: (tpl)->
        winContent = tpl({profile: that.model})
        dWindow(winContent, {
          wrapperId: "quick-add-child-win"
          closeOnSideClick: false
          buttons:
            "add":   "add"
            "cancel": "cancel"
          buttonClick: (btType, $win)->
            if btType is "add"
              $form = $win.find("form:first")
              formData = $form.serialize()
              childModel = new Kin.ChildModel
              childModel.save null,
                data: formData
                success: ()->
                  that.cacheFormData()
                  that.render ()->
                    that.restoreFormData()
                  $.jGrowl("Child added successfully")
                error: ()->
                  $.jGrowl("Child could not be added :( Please try again.")
            $win.close()
        })

  cacheFormData: ()=>
    that = @
    $form = @$("#send-invite-form")
    @cachedFormData = {}
    $inputs = $form.find("input")
    $inputs.each (index, input)->
      $input = $(input)
      that.cachedFormData[$input.attr("name")] = $input.val()
  
  restoreFormData: ()=>
    $form = @$("#send-invite-form")
    for inputName, inputData of @cachedFormData
      $form.find("input[name='#{inputName}']:first").val(inputData)

  remove: ()->
    @unbind()
    $(@el).unbind().empty()