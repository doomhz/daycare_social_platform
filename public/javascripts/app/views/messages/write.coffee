class Kin.Messages.WriteView extends Backbone.View

  el: null

  tplUrl: '/templates/main/messages/write.html'

  tpl: null

  collection: null

  events:
    "submit #write-message-form"   : "sendMessage"

  initialize: ()->

  render: ()->
    that = @
    $.tmpload
      url: @tplUrl
      onLoad: (tpl)->
        that.tpl = tpl
        if that.model
          that.model.fetch
            success: that.renderWhenCollectionLoaded
        else
          that.renderWhenCollectionLoaded()

  renderWhenCollectionLoaded: ()=>
    that = @
    @collection.fetch
      success: ()->
        $(that.el).html(that.tpl({users: that.collection, message: that.model}))
        that.$(".chzn-select").chosen()
        that.$("textarea:first").autoResize
          extraSpace: 30

  sendMessage: (ev)->
    ev.preventDefault()
    that = @
    $form = $(ev.target)
    recipients = $form.find("select[name='to_id']").val()
    $textarea = $form.find("textarea")
    if _.str.trim($textarea.val()).length and recipients
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