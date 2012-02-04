class Kin.Staff.InvitesView extends Backbone.View

  el: null

  model: null

  tplUrl: '/templates/main/staff/invites.html'

  events:
    "submit #send-invite-form": "sendInvite"

  initialize: ()->

  render: ()->
    that = @
    $.tmpload
      url: @tplUrl
      onLoad: (tpl)->
        $(that.el).html(tpl({profile: that.model, classes: that.model.get("daycare_friends")}))
        that.$(".chzn-select").chosen()

        that.friendRequestsList = new Kin.Staff.FriendRequestsListView
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

    staffData = @getFormData($form, "staff")

    if staffData
      if @isUniqueEmail(staffData.email)
        @saveFriendRequest(staffData)
      else
        dAlert("An invite has already been sent to #{staffData.email}.<br />Please choose another one.")

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
      classes_ids: $form.find("select[name='classes_ids']").val()
      type: "staff"
    if data.name and data.surname and data.email
      return data
    else
      false

  isUniqueEmail: (email)->
    sameEmailInvites = @collection.find (invite)->
      invite.get("email") is email
    not sameEmailInvites

  remove: ()->
    @unbind()
    $(@el).unbind().empty()