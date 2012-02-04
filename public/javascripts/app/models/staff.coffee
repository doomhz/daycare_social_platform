class Kin.StaffModel extends Backbone.Model

  defaults:
    name:    undefined
    surname: undefined

  urlRoot: "/staff"

  initialize: (attributes, options)->
    @id = @get("_id")

  url: ()->
    id = if @get("_id") then "/#{@get("_id")}" else ""
    "#{@urlRoot}#{id}"