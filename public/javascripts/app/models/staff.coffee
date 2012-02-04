class Kin.StaffModel extends Kin.UserModel

  urlRoot: "/staff"

  initialize: (attributes, options)->
    @id = @get("_id")

  url: ()->
    id = if @get("_id") then "/#{@get("_id")}" else ""
    "#{@urlRoot}#{id}"