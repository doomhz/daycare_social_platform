class Kin.Class.ChildrenListView extends Backbone.View

  collection: null

  model: null

  tplUrl: '/templates/main/class/children_list.html'

  tplUrlEditors: '/templates/main/class/editors.html'

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

            $.tmpload
              url: that.tplUrlEditors
              onLoad: (tpl)->

                $editors = $(tpl())

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

                that.$(".gender-edit-select").doomEdit
                  ajaxSubmit: false
                  autoDisableBt: false
                  submitOnBlur: true
                  submitBtn: false
                  cancelBtn: false
                  editField: $editors.find("#gender-editor-cnt").html()
                  onStartEdit: ($form, $elem)->
                    $form.find('select').val($elem.text())
                  afterFormSubmit: (data, $form, $el)->
                    $el.text(data)
                    fieldName = $el.data("field")
                    childId = $el.data("id")
                    child = new Kin.ChildModel
                      _id: childId
                    child.attributes[fieldName] = data
                    child.save(null, {silent: true})

                that.$(".birthday-edit-select").doomEdit
                  ajaxSubmit: false
                  autoDisableBt: false
                  submitOnBlur: false
                  cancelBtn: false
                  editField: $editors.find("#birthday-editor-cnt").html()
                  onStartEdit: ($form, $elem)->
                    birthday = $elem.text().split("-")
                    $form.find('select[name*="[year]"]').find("option[value='#{birthday[0]}']").attr("selected", "selected")
                    $form.find('select[name*="[month]"]').find("option[value='#{birthday[1].replace(/^0/, '')}']").attr("selected", "selected")
                    $form.find('select[name*="[day]"]').find("option[value='#{birthday[2].replace(/^0/, '')}']").attr("selected", "selected")
                  afterFormSubmit: (data, $form, $el)->
                    year = $form.find('select[name*="[year]"]').find(":selected").val()
                    month = $form.find('select[name*="[month]"]').find(":selected").val()
                    day = $form.find('select[name*="[day]"]').find(":selected").val()
                    birthday = "#{year}-#{month}-#{day}"
                    $el.text(birthday)
                    fieldName = $el.data("field")
                    childId = $el.data("id")
                    child = new Kin.ChildModel
                      _id: childId
                    child.attributes[fieldName] = birthday
                    child.save(null, {silent: true})

  deleteChildHandler: (ev)=>
    ev.preventDefault()
    childId = $(ev.target).data("id")
    child = new Kin.ChildModel
      _id: childId
    child.destroy
      success: @render