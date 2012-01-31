class Kin.DayCare.InvitesView extends Backbone.View

  el: null

  model: null

  tplUrl: '/templates/main/day_care/invites.html'

  events:
    "submit #send-invite-form" : "sendInvite"

  initialize: ()->

  render: ()->
    that = @
    $.tmpload
      url: @tplUrl
      onLoad: (tpl)->
        children = new Kin.ChildrenCollection([], {userId: that.model.get("_id")})
        children.fetch
          success: ()->
            $(that.el).html(tpl({profile: that.model, classes: that.model.get("daycare_friends"), children: children.models}))
            that.$(".chzn-select").chosen()

            that.friendRequestsList = new Kin.DayCare.FriendRequestsListView
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

    if mothersData
      @saveFriendRequest(mothersData)
    if fathersData
      @saveFriendRequest(fathersData)

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
      parent_type: fieldPrefix
    if data.name and data.surname and data.email
      return data
    else
      false

  remove: ()->
    @unbind()
    $(@el).unbind().empty()