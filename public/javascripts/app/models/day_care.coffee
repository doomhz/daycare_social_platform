class window.Kin.DayCareModel extends Backbone.Model

  defaults:
    _id: null
    name: ''
    speaking_classes: []
    location: []
    email: ''
    phone: ''
    contact_person: ''
    licensed: false
    type: 'daycare'
    opened_since: ''
    open_door_policy: false
    serving_disabilities: false

  uri: "/day-cares/load"

  initialize: (options, uri)->
    @uri = uri or @uri
    @id = @get('_id') or @id
    @

  url: ()->
    "#{@uri}/#{@id}"