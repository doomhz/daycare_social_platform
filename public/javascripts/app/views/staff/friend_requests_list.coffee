class Kin.Staff.FriendRequestsListView extends Backbone.View

  collection: null

  model: null

  tplUrl: '/templates/main/staff/friend_requests_list.html'

  events:
    "click .staff-name"                 : "staffNameClickHandler"
    "submit .friend-request-class-form" : "editClassesSubmitHandler"
    "click .cancel-request"             : "cancelRequestClickHandler"
    "click .resend-request"             : "resendRequestClickHandler"

  initialize: ()->

  render: ()->
    that = @
    $.tmpload
      url: @tplUrl
      onLoad: (tpl)->
        $el = $(that.el)
        $el.html(tpl({friendRequests: that.collection, profile: that.model, classes: that.model.get("daycare_friends")}))
        that.$(".chzn-select").chosen()

  staffNameClickHandler: (ev)->
    ev.preventDefault()
    $target= $(ev.target)
    requestId = $target.data("id")
    $classContainer = @$("#class-cnt-#{requestId}")
    $classContainer.toggleClass("hidden")

  closeEditClassCnt: (requestId)->
    @$("#class-cnt-#{requestId}").addClass("hidden")

  editClassesSubmitHandler: (ev)->
    ev.preventDefault()
    that = @
    $target= $(ev.target)
    data = $target.serialize()
    friendRequestId = $target.data("id")
    friendRequest = new Kin.FriendRequestModel
      _id: friendRequestId
    friendRequest.save null,
      data: data
      success: ()->
        $.jGrowl("Classes successfully changed")
        that.closeEditClassCnt(friendRequestId)
      error: ()->
        $.jGrowl("Classes could not be changed :( Please try again.")

  cancelRequestClickHandler: (ev)=>
    ev.preventDefault()
    that = @
    $target = $(ev.target)
    dConfirm "Are you sure you want to cancel the invite?", (btType, win)->
      win.close()
      if btType is 'yes'
        friendRequestId = $target.data("id")
        friendRequest = that.collection.get(friendRequestId)
        friendRequest.destroy
          wait: true
          success: ()->
            $.jGrowl("Invite was canceled")
            that.render()
          error: ()->
            $.jGrowl("Invite could not be canceled :( Please try again.")

  resendRequestClickHandler: (ev)=>
    ev.preventDefault()
    that = @
    $target = $(ev.target)
    dConfirm "Are you sure you want to resend the invite?", (btType, win)->
      win.close()
      if btType is 'yes'
        friendRequestId = $target.data("id")
        friendRequest = that.collection.get(friendRequestId)
        friendRequest.send
          success: ()->
            $.jGrowl("Invite was resent")
          error: ()->
            $.jGrowl("Invite could not be sent :( Please try again.")
