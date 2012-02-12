class window.Kin.Profile.ProfileSide1View extends Backbone.View

  el: null

  tplUrl:
    daycare: '/templates/side1/day_care/profile.html'
    parent:  '/templates/side1/parent/profile.html'
    staff:  '/templates/side1/staff/profile.html'
    class:  '/templates/side1/class/profile.html'

  quickMessageTplUrl: '/templates/side1/messages/quick_message_box.html'

  selectedMenuItem: null

  events:
    "click #quick-message-bt": "quickMessageHandler"

  initialize: ({@selectedMenuItem})->
    @model and @model.view = @
    @

  render: ()->
    that = @
    $.tmpload
      url: @tplUrl[@model.get("type")]
      onLoad: (tpl)->
        $(that.el).html(tpl({profile: that.model, selectedMenuItem: that.selectedMenuItem}))
    @

  remove: ()->
    @unbind()
    $(@el).unbind().empty()
    @

  quickMessageHandler: (ev)->
    ev.preventDefault()
    @showQuickMessageWindow(@model)

  showQuickMessageWindow: (profile)->
    that = @
    $.tmpload
      url: @quickMessageTplUrl
      onLoad: (tpl)->
        winContent = tpl({profile: profile})
        dWindow(winContent, {
          wrapperId: "quick-message-win"
          closeOnSideClick: false
          buttons:
            "send":   "send"
            "cancel": "cancel"
          buttonClick: (btType, $win)->
            if btType is "send"
              $form = $win.find("form:first")
              formData = $form.serialize()
              messageModel = new Kin.MessageModel
              messageModel.save null,
                data: formData
                success: ()->
                  toName = $win.find("#message-to-name").text()
                  $.jGrowl("Message sent to #{toName}")
                error: ()->
                  $.jGrowl("Message could not be sent :( Please try again.")
            $win.close()
        })