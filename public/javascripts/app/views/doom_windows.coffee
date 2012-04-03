class Kin.DoomWindowsView extends Backbone.View

  windowOptions: {}

  initialize: ()->
    @windowOptions.buttonClick = @onButtonClick

  onButtonClick: (btType, $win)=>
    $win.close()

  open: (winContent)=>
    dWindow winContent, @windowOptions
    @el = $("##{@windowOptions.wrapperId}")

  close: ()=>
    $(@el).close()