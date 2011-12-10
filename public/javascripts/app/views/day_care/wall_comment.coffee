class Kin.DayCare.WallCommentView extends Backbone.View
  
  tagName: 'li'

  tplUrl: '/templates/main/day_care/wall_comment.html'

  initialize: ()->
    @model and @model.view = @
    @

  render: ()->
    that = @
    $.tmpload
      url: @tplUrl
      onLoad: (tpl)->
        $(that.el).addClass(that.model.get("type")).attr("data-id", that.model.get("_id")).html(tpl({comment: that.model}))
        if that.model.get("type") is "status"
          that.$(".add-followup-form:first textarea").autoResize
            extraSpace: -4
          
          that.$('a[rel^="prettyPhoto"]').prettyPhoto
            slideshow: false
            social_tools: false
            theme: 'light_rounded'
            deeplinking: false
            animation_speed: 0
    @
  
  deferOnTemplateLoad: (callback)->
    $.tmpload
      url: @tplUrl
      onLoad: (tpl)->
        callback()