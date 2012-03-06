class Kin.DayCare.SectionView extends Backbone.View

  el: null

  tplUrl: '/templates/main/day_care/{sectionName}.html'

  tagInputsTplUrl: '/templates/main/day_care/tag_inputs.html'

  tagListTplUrl: '/templates/main/day_care/tag_list.html'

  tagFormTplUrl: '/templates/main/day_care/tag_form.html'

  model: null

  profile: null

  events:
    "submit #edit-section-form": "submitSectionFormHandler"

  initialize: (options = {})->
    @profile = options.profile

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
            $(that.el).html(tpl({section: model, profile: that.profile, view: that}))
            that.$(".chzn-select").chosen()
            that.$(".time-picker").timePicker
              step: 15
            that.$("#add-typical-day-bt").bind "click", that.addTypicalDayHandler
            that.$("#edit-typical-day-list").delegate ".delete-typical-day", "click", that.deleteTypicalDayHandler

  renderTagInputs: (type, tags, selectedTags, add = false)->
    that = @
    tpl = $.tmpload
      url: @tagInputsTplUrl
      onLoad: (tpl)->
        $list = that.$("##{type}-inputs")
        if add
          $list.append(tpl({type: type, tags: tags, selectedTags: selectedTags}))
        else
          $list.html(tpl({type: type, tags: tags, selectedTags: selectedTags}))
          that.renderTagForm($list, type)

  renderTagList: (type, tags, selectedTags)->
    that = @
    tpl = $.tmpload
      url: @tagListTplUrl
      onLoad: (tpl)->
        that.$("##{type}-list").html(tpl({type: type, tags: tags, selectedTags: selectedTags}))

  renderTagForm: ($list, type)=>
    that = @
    tpl = $.tmpload
      url: @tagFormTplUrl
      onLoad: (tpl)->
        formHtml = tpl({type: type})
        $list.after(formHtml)
        $list.next("form").bind "submit", that.submitAddTagFormHandler

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

  submitAddTagFormHandler: (ev)=>
    ev.preventDefault()
    that = @
    $form = $(ev.target)
    formData = $form.serialize()
    tag = new Kin.TagModel
    tag.save null
      data: formData
      success: (model)->
        that.renderTagInputs(model.get("type"), [model], [model.get("_id")], true)
        $form.find("input[name='name']").val("")
      error: ()->
        $.jGrowl("Tag could not be saved :( Please try again.")

  addTypicalDayHandler: (ev)=>
    ev.preventDefault()
    $cnt = @$("#add-typical-day-cnt")
    $typicalDayList = @$("#edit-typical-day-list")
    $newCnt = $cnt.clone()
    $newCnt.removeClass("hidden")
    newIndex = $typicalDayList.find("li:last").data("index") + 1
    $newCnt = $newCnt.html().replace(/index/g, newIndex)
    $typicalDayList.append("<li data-index='#{newIndex}'>#{$newCnt}</li>")
    $typicalDayList.find(".time-picker").timePicker
      step: 15

  deleteTypicalDayHandler: (ev)->
    ev.preventDefault()
    $el = $(ev.target)
    $el.parents("li:first").remove()

  remove: ()->
    @unbind()
    $(@el).unbind().empty()
