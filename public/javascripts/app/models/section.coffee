class Kin.SectionModel extends Backbone.Model

  uri: "/day-care/section/:section_name/:id"

  initialize: (attributes, options)->

  url: ()->
    @uri.replace(":section_name", @get("name")).replace(":id", @get("id"))

  exists: (name)->
    @get(name) and @get(name).length
