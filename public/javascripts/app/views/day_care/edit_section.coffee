class Kin.DayCare.EditSectionView extends Kin.DayCare.SectionView

  tplUrl: '/templates/main/day_care/edit_{sectionName}.html'

  events:
    "submit #edit-section-form": "submitSectionFormHandler"

  render: ()->
    super(@loadEditableFields)

  loadEditableFields: ()=>
    @$(".chzn-select").chosen()
    @$(".time-picker").timePicker
      step: 15
    @$("#add-typical-day-bt").bind "click", @addTypicalDayHandler
    @$("#edit-typical-day-list").delegate ".delete-typical-day", "click", @deleteTypicalDayHandler

  submitSectionFormHandler: (ev)->
    ev.preventDefault()
    $form = $(ev.target)
    $formClone = $form.clone()
    $formClone.find("form").remove()
    formData = $formClone.serialize()
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
    if $form.valid()
      $tag = $form.find("input[name='name']")
      formData = $form.serialize()
      tag = new Kin.TagModel
      tag.save null
        data: formData
        success: (model)->
          that.renderTagInputs(model.get("type"), [model], [model.get("_id")], true)
          $tag.val("")
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
