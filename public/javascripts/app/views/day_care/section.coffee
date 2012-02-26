class Kin.DayCare.SectionView extends Backbone.View
  
  el: null

  tplUrl: '/templates/main/day_care/{sectionName}.html'

  tagInputsTplUrl: '/templates/main/day_care/tag_inputs.html'

  tagListTplUrl: '/templates/main/day_care/tag_list.html'

  model: null

  events:
    "submit #edit-section-form": "submitSectionFormHandler"

  initialize: (options)->

  getTags: (type, callback)->
    tags = new Kin.TagsCollection [], {type: type}
    tags.fetch
      success: (collection)->
        callback(collection.models)

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

  renderTagInputs: (type, tags, selectedTags)->
    that = @
    tpl = $.tmpload
      url: @tagInputsTplUrl
      onLoad: (tpl)->
        that.$("##{type}-inputs").html(tpl({tags: tags, selectedTags: selectedTags}))

  renderTagList: (type, tags, selectedTags)->
    that = @
    tpl = $.tmpload
      url: @tagListTplUrl
      onLoad: (tpl)->
        that.$("##{type}-list").html(tpl({tags: tags, selectedTags: selectedTags}))

  displayTagInputs: (type)->
    that = @
    selectedTags = @model.get(type)
    @getTags type, (tags)->
      that.renderTagInputs(type, tags, selectedTags)

  displayTagList: (type)->
    that = @
    selectedTags = @model.get(type)
    @getTags type, (tags)->
      that.renderTagList(type, tags, selectedTags)

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
