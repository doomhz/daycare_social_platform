class Kin.ChildModel extends Backbone.Model

  defaults:
    name:    undefined
    surname: undefined

  urlRoot: "/child"

  initialize: (attributes, options)->
    @id = @get("_id")

  url: ()->
    id = if @get("_id") then "/#{@get("_id")}" else ""
    "#{@urlRoot}#{id}"