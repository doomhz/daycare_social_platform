class Kin.Messages.FromProfileView extends Backbone.View

  el: null

  collection: null

  model: null

  tplUrl: '/templates/main/messages/from_profile.html'

  initialize: ()->
    @collection.comparator = ()->
      -1

  render: ()->
    that = @
    $.tmpload
      url: @tplUrl
      onLoad: (tpl)->
        that.collection.fetch
          success: ()->
            $(that.el).html(tpl({messages: that.collection, profile: that.model}))
            that.$(".time").timeago()
            that.$(".add-reply-message-form:first textarea").autoResize
              extraSpace: -2
            that.$(".add-reply-message-form:first").bind("submit", that.sendReply)
            that.updateUnreadStatus()

  sendReply: (ev)=>
    ev.preventDefault()
    that = @
    $form = $(ev.target)
    $textarea = $form.find("textarea")
    if $textarea.val().length
      formData = $form.serialize()
      messageModel = new Kin.MessageModel
      messageModel.save null,
        data: formData
        success: ()->
          toName = "#{that.model.get('name')} #{that.model.get('surname')}"
          $.jGrowl("Reply message sent to #{toName}")
          that.render()
        error: ()->
          $.jGrowl("Message could not be sent :( Please try again.")

  updateUnreadStatus: ()->
    @collection.markMessagesAsRead()

  remove: ()->
    @unbind()
    $(@el).unbind().empty()