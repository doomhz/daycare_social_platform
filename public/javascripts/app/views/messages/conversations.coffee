class Kin.Messages.ConversationsView extends Backbone.View

  el: null

  collection: null

  tplUrl: '/templates/main/messages/conversations.html'

  initialize: ()->

  render: ()->
    that = @
    $.tmpload
      url: @tplUrl
      onLoad: (tpl)->
        that.collection.fetch
          success: ()->
            $(that.el).html(tpl({messages: that.collection}))
            that.$(".time").timeago()

  remove: ()->
    @unbind()
    $(@el).unbind().empty()