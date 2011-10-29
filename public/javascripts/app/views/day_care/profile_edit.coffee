class window.Kin.DayCare.ProfileEditView extends Backbone.View

  el: null

  tplUrl: '/templates/main/day_care/edit.html'

  events:
    'submit #day-care-edit-form': 'saveDayCare'

  initialize: ()->
    @model and @model.view = @
    @

  render: ()->
    that = @
    $.tmpload
      url: @tplUrl
      onLoad: (tpl)->
        $(that.el).html(tpl({dayCare: that.model}))
    @

  remove: ()->
    @unbind()
    $(@el).unbind().empty()
    @

  saveDayCare: (ev)->
    ev.preventDefault()
    formData = {}
    (formData[key] = @getFieldValue($(ev.target).find("select[name='#{key}'],input[name='#{key}']&&[type='text'],input[name='#{key}']&&[type='radio']&&[checked=true]"))) for key, value of @model.defaults
#    console.log(formData)

    @model.set(formData)
    @model.save {},
      success: ()->
        $(ev.target).find('.form-messages').text('Day care information is up to date.')
      error: ()->
        $(ev.target).find('.form-messages').text('Day care information could not be updated.')

    false

  getFieldValue: ($field)->
    data = []
    if $field.length
      switch $field[0].nodeName
        when 'SELECT' then $field.find('option:selected').each((index, el)-> data[index] = $(el).val())
        when 'INPUT' then data = $field.val()
    data
