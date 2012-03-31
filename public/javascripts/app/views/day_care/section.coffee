class Kin.DayCare.SectionView extends Backbone.View

  el: null

  tplUrl: '/templates/main/day_care/{sectionName}.html'

  tagInputsTplUrl: '/templates/main/day_care/tag_inputs.html'

  tagListTplUrl: '/templates/main/day_care/tag_list.html'

  tagFormTplUrl: '/templates/main/day_care/tag_form.html'

  model: null

  profile: null

  initialize: (options = {})->
    @profile = options.profile

  getTags: (type, callback)->
    tags = new Kin.TagsCollection [], {type: type}
    tags.fetch
      success: (collection)->
        callback(collection.models)

  render: (callback = ()->)->
    that = @
    tplUrl = @tplUrl.replace("{sectionName}", @model.get("name")).replace(/-/g, "_")
    $.tmpload
      url: tplUrl
      onLoad: (tpl)->
        that.model.fetch
          success: (model)->
            $(that.el).html(tpl({section: that.model, profile: that.profile, view: that}))
            callback()

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
        $form = $list.next("form")
        $form.bind("submit", that.submitAddTagFormHandler)
        $form.validate()

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

  remove: ()->
    @unbind()
    $(@el).unbind().empty()
