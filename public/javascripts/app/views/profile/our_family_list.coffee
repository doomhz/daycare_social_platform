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

  findByName: (nameToFind)->
    @membersLists = @membersLists or @$(".our-family-member")
    @membersLists.addClass("hidden")
    memberIds = @filterMembers(nameToFind)
    for memberId in memberIds
      @membersLists.filter("#member-#{memberId}").removeClass("hidden")

  filterMembers: (slug)->
    memberIds = []
    @staff.each (st)->
      if st.get("name").toLowerCase().indexOf(slug) > -1 or st.get("surname").toLowerCase().indexOf(slug) > -1
        memberIds.push(st.get("_id"))
    children = @children.filter (child)->
      child.get("name").toLowerCase().indexOf(slug) > -1 or child.get("surname").toLowerCase().indexOf(slug) > -1
    childrenIds = _.map children, (child)->
      child.get("_id")
    @parents.each (parent)->
      foundChildren = _.intersection(childrenIds, parent.children_ids).length
      if parent.get("name").toLowerCase().indexOf(slug) > -1 or parent.get("surname").toLowerCase().indexOf(slug) > -1 or foundChildren
        memberIds.push(parent.get("_id"))
    memberIds

  remove: ()->
    $el = $(@el)
    @unbind()
    $el.unbind().empty()
    @