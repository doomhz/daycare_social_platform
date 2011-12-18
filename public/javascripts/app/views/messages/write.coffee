class Kin.Messages.WriteView extends Backbone.View
  
  el: null

  tplUrl: '/templates/main/messages/write.html'
  
  collection: null
  
  events:
    "submit #write-message-form": "sendMessage"

  initialize: ()->

  render: ()->
    that = @
    $.tmpload
      url: @tplUrl
      onLoad: (tpl)->
        that.collection.fetch
          success: ()->
            $(that.el).html(tpl({users: that.collection}))
            that.$(".chzn-select").chosen()
            that.$("textarea:first").autoResize
              extraSpace: 30

  sendMessage: (ev)->
    ev.preventDefault()
    that = @
    $form = $(ev.target)
    formData = $form.serialize()
    messageModel = new Kin.MessageModel
    messageModel.save null,
      data: formData
      success: ()->
        $form.find("textarea:first").val("").keyup()
        $.jGrowl("Message sent")
      error: ()->
        $.jGrowl("Message could not be sent :( Please try again.")

  remove: ()->
    @unbind()
    $(@el).unbind().empty()