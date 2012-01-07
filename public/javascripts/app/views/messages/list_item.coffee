class window.Kin.Messages.ListItemView extends Backbone.View

  tagName: 'li'

  tplUrl: '/templates/main/messages/list_item.html'
  
  events:
    "click .message-header-cnt" : "toggleMessageBody"
    "click .delete-message-bt"  : "deleteMessage"

  initialize: ()->
    @model and @model.view = @

  render: ()->
    that = @
    $.tmpload
      url: @tplUrl
      onLoad: (tpl)->
        $(that.el).html(tpl({message: that.model}))
        
        that.$(".time").timeago()
        
        if that.model.get("unread")
          $(that.el).addClass("unread")
          
        if that.model.get("type") is "default"
          that.$(".add-reply-message-form:first textarea").autoResize
            extraSpace: -2
          that.$(".add-reply-message-form:first").bind("submit", that.sendReply)
  
  toggleMessageBody: ()->
    that = @
    $messageBodyCnt = @$(".message-body-cnt:first")
    $messageBodyCnt.toggleClass("hidden")
    if @model.get("unread")
      @model.set({"unread": false})
      @model.save null,
        success: ()->
          $(that.el).removeClass("unread")
          
  
  sendReply: (ev)=>
    ev.preventDefault()
    that = @
    $form = $(ev.target)
    formData = $form.serialize()
    messageModel = new Kin.MessageModel
    messageModel.save null,
      data: formData
      success: ()->
        toName = that.$("#message-to-name").text()
        $form.find("textarea:first").val("").keyup()
        $.jGrowl("Reply message sent to #{toName}")
      error: ()->
        $.jGrowl("Message could not be sent :( Please try again.")
  
  deleteMessage: (ev)->
    ev.preventDefault()
    @model.destroy()
    @remove()