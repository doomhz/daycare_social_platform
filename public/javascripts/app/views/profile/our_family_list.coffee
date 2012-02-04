class window.Kin.Profile.OurFamilyListView extends Backbone.View

  model: null

  el: null

  tplUrl: '/templates/main/profile/our_family_list.html'

  initialize: ()->

  render: ()->
    that = @
    $.tmpload
      url: @tplUrl
      onLoad: (tpl)->
        classes = new Kin.ClassesCollection [], {masterId: that.model.get("_id")}
        classes.fetch
          success: ()->
            staff = new Kin.StaffCollection [], {userId: that.model.get("_id")}
            staff.fetch
              success: ()->
                parents = new Kin.ParentsCollection [], {userId: that.model.get("_id")}
                parents.fetch
                  success: ()->
                    children = new Kin.ChildrenCollection [], {userId: that.model.get("_id")}
                    children.fetch
                      success: ()->
                        $el = $(that.el)
                        $el.html(tpl({profile: that.model, classes: classes, staff: staff, parents: parents, children: children}))

  findByName: (nameToFind)->
    $parentsLists = @$(".parents-details")
    for list in $parentsLists
      $list = $(list)
      filteredText = $list.text().toLowerCase().replace(/\\n/g, " ").replace(/\s\s/g, "")
      if filteredText.indexOf(nameToFind) > -1
        $list.removeClass("hidden")
      else
        $list.addClass("hidden")

  remove: ()->
    $el = $(@el)
    @unbind()
    $el.unbind().empty()
    @