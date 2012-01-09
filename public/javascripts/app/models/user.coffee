class Kin.UserModel extends Backbone.Model

  defaults:
    _id: null
    name: ''
    username: ''
    speaking_classes: []
    address: ''
    location:
      lat: 10
      lng: 40
    email: ''
    phone: ''
    fax: ''
    contact_person: ''
    licensed: false
    license_number: ''
    type: 'daycare'
    opened_since: ''
    open_door_policy: false
    serving_disabilities: false
    picture_sets: []


  url: '/current-user'

  canEditDayCare: (dayCareId)->
    dayCareId is @get('_id')