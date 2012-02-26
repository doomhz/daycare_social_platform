class Kin.TagModel extends Backbone.Model

  defaults:
    name:    undefined

  urlRoot: "/tag"

  initialize: (attributes, options)->
    @id = @get("_id")

  url: ()->
    id = if @get("_id") then "/#{@get("_id")}" else ""
    "#{@urlRoot}#{id}"