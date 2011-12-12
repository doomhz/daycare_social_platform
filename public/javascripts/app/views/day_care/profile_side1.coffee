class window.Kin.DayCare.ProfileSide1View extends Backbone.View

  el: null

  tplUrl: '/templates/side1/day_care/profile.html'
  
  quickMessageTplUrl: '/templates/side1/day_care/quick_message_box.html'
  
  selectedMenuItem: null

  events:
    "click #quick-message-bt": "quickMessageHandler"
  
  initialize: ({@selectedMenuItem})->
    @model and @model.view = @
    @

  render: ()->
    that = @
    $.tmpload
      url: @tplUrl
      onLoad: (tpl)->
        $(that.el).html(tpl({dayCare: that.model, selectedMenuItem: that.selectedMenuItem}))
    @

  remove: ()->
    @unbind()
    $(@el).unbind().empty()
    @

  quickMessageHandler: (ev)->
    ev.preventDefault()
    @showQuickMessageWindow()
  
  showQuickMessageWindow: ()->
    that = @
    $.tmpload
      url: @quickMessageTplUrl
      onLoad: (tpl)->
        winContent = tpl({dayCare: that.model})
        dWindow(winContent, {
          closeOnSideClick: false
          buttons:
            "send":   "send"
            "cancel": "cancel"
          buttonClick: (btType, $win)->
            if btType is "send"
              $.jGrowl("Message sent!")
            $win.close()
        })