class Kin.NotificationModel extends Backbone.Model

  urlRoot: "/notification"

  initialize: (attributes, options)->
    @id = @get("_id")
