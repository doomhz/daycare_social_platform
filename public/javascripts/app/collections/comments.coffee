class Kin.CommentsCollection extends Backbone.Collection

  model: Kin.CommentModel

  uri: "/comments/:comment_id"

  commentId: null

  initialize: (models, options = {})->
  	@commentId = options.commentId
 
  url: ()->
  	"#{@uri.replace(":comment_id", @commentId)}"
 
