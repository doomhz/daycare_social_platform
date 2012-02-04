class window.Kin.Profile.OurFamilyListView extends Backbone.View

  model: null

  el: null

  tplUrl: '/templates/main/profile/our_family_list.html'

  membersLists: null

  staff: null

  parents: null

  children: null

  initialize: ()->

  render: ()->
    that = @
    $.tmpload
      url: @tplUrl
      onLoad: (tpl)->
        classes = new Kin.ClassesCollection [], {masterId: that.model.get("_id")}
        classes.fetch
          success: ()->
            that.staff = new Kin.StaffCollection [], {userId: that.model.get("_id")}
            that.staff.fetch
              success: ()->
                that.parents = new Kin.ParentsCollection [], {userId: that.model.get("_id")}
                that.parents.fetch
                  success: ()->
                    that.children = new Kin.ChildrenCollection [], {userId: that.model.get("_id")}
                    that.children.fetch
                      success: ()->
                        $el = $(that.el)
                        $el.html(tpl({profile: that.model, classes: classes, staff: that.staff, parents: that.parents, children: that.children}))

  findByNameAndType: (nameToFind, typeToFind)->
    @membersLists = @membersLists or @$(".our-family-member")
    @membersLists.addClass("hidden")
    memberIds = @filterMembers(nameToFind, typeToFind)
    for memberId in memberIds
      @membersLists.filter("#member-#{memberId}").removeClass("hidden")

  filterMembers: (slug, type)->
    types = if type is "all" then ["staff", "parents", "children"] else [type]
    memberIds = []
    childrenIds = []
    if "staff" in types
      @staff.each (st)->
        if "#{st.get('name')} #{st.get('surname')}".toLowerCase().indexOf(slug) > -1
          memberIds.push(st.get("_id"))
    if "children" in types
      children = @children.filter (child)->
        "#{child.get('name')} #{child.get('surname')}".toLowerCase().indexOf(slug) > -1
      childrenIds = _.map children, (child)->
        child.get("_id")
      @parents.each (parent)->
        foundChildren = _.intersection(childrenIds, parent.get("children_ids")).length
        if foundChildren
          memberIds.push(parent.get("_id"))
    if "parents" in types
      @parents.each (parent)->
        foundChildren = _.intersection(childrenIds, parent.get("children_ids")).length
        if "#{parent.get('name')} #{parent.get('surname')}".toLowerCase().indexOf(slug) > -1
          memberIds.push(parent.get("_id"))
    _.uniq(memberIds)

  remove: ()->
    $el = $(@el)
    @unbind()
    $el.unbind().empty()
    @