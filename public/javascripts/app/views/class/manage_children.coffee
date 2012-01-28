class Kin.Class.ManageChildrenView extends Backbone.View

  el: null

  tplUrl: '/templates/main/class/manage_children.html'

  events:
    "submit #add-child-form" : "addChild"

  initialize: ()->
    super()

  render: ()->
    that = @
    $.tmpload
      url: @tplUrl
      onLoad: (tpl)->
        $(that.el).html(tpl({profile: that.model}))

        that.childrenList = new Kin.Class.ChildrenListView
          el: that.$("#children-list")
          collection: that.collection
          model: that.model
        that.childrenList.render()

  addChild: (ev)->
    ev.preventDefault()
    that = @
    $form = $(ev.target)
    formData = $form.serialize()
    childModel = new Kin.ChildModel
    childModel.save null,
      data: formData
      success: ()->
        childName = $form.find("input[name='name']").val()
        childSurname = $form.find("input[name='surname']").val()
        $.jGrowl("#{childName} #{childSurname} successfully added to this group")
        that.render()
      error: ()->
        $.jGrowl("There was an error adding the child :( Please try again.")

  remove: ()->
    @unbind()
    $(@el).unbind().empty()