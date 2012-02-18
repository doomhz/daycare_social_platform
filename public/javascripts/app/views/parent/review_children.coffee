class Kin.Parent.ReviewChildrenView extends Backbone.View

  tplUrl: '/templates/main/parent/review_children_box.html'

  currentUser: null

  initialize: ({@currentUser})->

  render: ()->
    that = @
    $.tmpload
      url: @tplUrl
      onLoad: (tpl)->
        children = new Kin.ChildrenCollection [],
          userId: that.currentUser.get("id")
        children.fetch
          success: ()->
            winContent = tpl({children: children})
            dWindow winContent,
              wrapperId: "review-children-win"
              closeOnSideClick: false
              headerButtons: false
              buttons:
                "save": "save"
              buttonClick: (btType, $win)->
                if btType is "save"
                  $forms = $win.find("form")
                  for form in $forms
                    $form = $(form)
                    hashedData = $form.hashForm()
                    if not hashedData.birthday.year or not hashedData.birthday.month or not hashedData.birthday.day
                      $.jGrowl("Please specify a correct date of birth")
                      return false
                    if hashedData.birthday
                      hashedData.birthday = "#{hashedData.birthday.year}-#{hashedData.birthday.month}-#{hashedData.birthday.day}"
                    childModel = new Kin.ChildModel
                    childModel.save hashedData,
                      success: ()->
                        $.jGrowl("Children information was updated")
                        $win.close()
                        that.currentUser.set({reviewed_children: true})
                        that.currentUser.save()
                      error: ()->
                        $.jGrowl("Children information could not be updated :( Please try again.")
