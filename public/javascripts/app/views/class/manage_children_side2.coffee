class Kin.Class.ManageChildrenSide2View extends Backbone.View

  tplUrl: '/templates/side2/class/manage_children.html'

  initialize: ()->

  render: ()->
    that = @
    $.tmpload
      url: @tplUrl
      onLoad: (tpl)->
        $el = $(that.el)
        $el.html(tpl())

  remove: ()->
    $el = $(@el)
    @unbind()
    $el.unbind()
    $el.empty()
