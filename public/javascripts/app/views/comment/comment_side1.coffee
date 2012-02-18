class window.Kin.Comment.CommentSide1View extends Backbone.View

  el: null

  tplUrl: '/templates/side1/comment/comment.html'

  model: null

  initialize: ()->

  render: ()->
    that = @
    $.tmpload
      url: @tplUrl
      onLoad: (tpl)->
        $(that.el).html(tpl({comment: that.model}))

  remove: ()->
    @unbind()
    $(@el).unbind().empty()
    @