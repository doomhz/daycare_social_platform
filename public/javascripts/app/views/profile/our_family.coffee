class window.Kin.Profile.OurFamilyView extends Backbone.View

  model: null

  el: null

  tplUrl: '/templates/main/profile/our_family.html'

  parentsList: null

  profileGeneralInfo: null

  currentUser: null

  router: null

  events:
    "keyup #our-family-name-filter": "filterNamesHandler"
    "click #our-family-name-filter-bt": "filterNamesHandler"
    "change #our-family-type-filter": "filterNamesHandler"

  initialize: (options)->
    @currentUser = options.currentUser
    @router = options.router

  render: ()->
    that = @
    $.tmpload
      url: @tplUrl
      onLoad: (tpl)->
        $el = $(that.el)
        $el.html(tpl({profile: that.model}))

        $parentsListGroup = $el.find("#our-family-list-cnt")
        that.parentsList = new Kin.Profile.OurFamilyListView
          el: $parentsListGroup
          model: that.model
        that.parentsList.render()

  filterNamesHandler: (ev)->
    textToFind = $.trim($("#our-family-name-filter").val().toLowerCase())
    typeToFind = $("#our-family-type-filter").val()
    @parentsList.findByNameAndType(textToFind, typeToFind)

  remove: ()->
    $el = $(@el)
    @unbind()
    $el.unbind().empty()
    @