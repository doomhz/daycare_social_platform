class Kin.Messages.InboxView extends Backbone.View
  
  el: null

  collection: null

  messageModelView: window.Kin.Messages.ListItemView

  tplUrl: '/templates/main/messages/inbox.html'

  initialize: ()->
    if @collection
      @collection.bind('add', @addMessagesListItem)
      @collection.bind('fetch', @addMessagesListItem)

  render: ()->
    that = @
    $.tmpload
      url: @tplUrl
      onLoad: (tpl)->
        $(that.el).html(tpl())
        that.collection.fetch({add: true})

  addMessagesListItem: (messageModel)=>
    messageView = new @messageModelView({model: messageModel})
    $list = $(@el).find('#messages-list')
    $list.append(messageView.el)
    messageView.render()

  remove: ()->
    @unbind()
    $(@el).unbind().empty()