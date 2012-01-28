class Kin.Class.ChildrenListView extends Backbone.View

  collection: null

  model: null

  tplUrl: '/templates/main/class/children_list.html'

  events:
    "click .delete-child": "deleteChildHandler"

  initialize: ()->

  render: ()=>
    that = @
    $.tmpload
      url: @tplUrl
      onLoad: (tpl)->
        that.collection.fetch
          success: ()->
            $el = $(that.el)
            $el.html(tpl({children: that.collection, profile: that.model}))

            that.$(".dedit-input-link").doomEdit
              ajaxSubmit: false
              submitOnBlur: true
              submitBtn: false
              cancelBtn: false
              afterFormSubmit: (data, form, $el)->
                $el.text(data)
                fieldName = $el.data("field")
                childId = $el.data("id")
                child = new Kin.ChildModel
                  _id: childId
                child.attributes[fieldName] = data
                child.save(null, {silent: true})

  deleteChildHandler: (ev)=>
    ev.preventDefault()
    childId = $(ev.target).data("id")
    child = new Kin.ChildModel
      _id: childId
    child.destroy
      success: @render