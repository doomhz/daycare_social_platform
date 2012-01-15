class Kin.Profile.FriendRequestsListView extends Backbone.View

  collection: null

  tplUrl: '/templates/main/profile/friend_requests_list.html'

  initialize: ()->

  render: ()->
    that = @
    $.tmpload
      url: @tplUrl
      onLoad: (tpl)->
        $el = $(that.el)
        $el.html(tpl({friendRequests: that.collection}))

