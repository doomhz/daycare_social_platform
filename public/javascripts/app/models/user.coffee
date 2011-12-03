class Kin.UserModel extends Backbone.Model

  defaults:
    _id:        null
    type:       null
    email:      null
    daycare_id: null

  url: '/current-user'

  canEditDayCare: (dayCareId)->
    dayCareId is @get('daycare_id')