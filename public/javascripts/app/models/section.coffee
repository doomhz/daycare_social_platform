class Kin.SectionModel extends Backbone.Model

  defaults:
    type: "section"

  uri: "/day-care/section/:section_name/:id"

  initialize: (attributes, options)->

  url: ()->
    @uri.replace(":section_name", @get("name")).replace(":id", @get("id"))
