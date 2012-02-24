class Kin.DayCare.SectionView extends Backbone.View
  
  el: null

  tplUrl: '/templates/main/day_care/{sectionName}.html'

  model: null

  events:
    "submit #edit-section-form": "submitSectionFormHandler"

  initialize: (options)->

  getGeneralAproachesToLearning: ()->
    ["Play-Based", "Co-op", "Montessori"]

  getLearningPhilosophyAndToolsLanguage: ()->
    ["Oral language", "Nursery rhymes", "poems", "songs", "Storybook", "reading", "Emerging", "literacy skills"]

  getLearningPhilosophyAndToolsCognitiveDev: ()->
    ["Math & number sense", "Time & space", "Sci. reasoning/physical world", "Music", "Visual arts", "Physical activity", "Other subjects taught (specify)"]

  getHomeSchoolConnections: ()->
    ["Notes", "Phone Calls", "Voice Mail", "Email", "Special Meetings", "Two or More Regular Conferences", "Drop-Off", "Pick-Up", "Regular newsletter/printed updates circulated to the whole school"]

  getHomeSchoolSeparations: ()->
    ["Pre-entry meetings with parents at school", "Extra staff dedicated to handle separation", "Small group sessions", "Parents in classroom early on", "Abbreviated schedule at start of school year"]

  getCertificates: ()->
    ["CPR Certified?", "First Aid Certified?", "FIA Accepted?", "Latchkey?", "Educational Programs?", "National Accreditation (NAFCC)?", "Smoke-Free Environment?", "Special Needs Children Accepted?", "Do You Have Webcams available in your classes?"]

  render: ()->
    that = @
    tplUrl = @tplUrl.replace("{sectionName}", @model.get("name")).replace(/-/g, "_")
    $.tmpload
      url: tplUrl
      onLoad: (tpl)->
        that.model.fetch
          success: (model)->
            $(that.el).html(tpl({section: model, view: that}))
            that.$(".chzn-select").chosen()

  submitSectionFormHandler: (ev)->
    ev.preventDefault()
    $form = $(ev.target)
    formData = $form.serialize()
    @model.save null
      data: formData
      success: ()->
        $.jGrowl("Data was successfully saved.")
      error: ()->
        $.jGrowl("Data could not be saved :( Please try again.")

  remove: ()->
    @unbind()
    $(@el).unbind().empty()