class window.Kin.Profile.ProfileView extends Backbone.View

  el: null

  tplUrl:
    daycare: "/templates/main/day_care/profile.html"
    parent:  "/templates/main/parent/profile.html"
    staff:  "/templates/main/staff/profile.html"
    class:  "/templates/main/class/profile.html"

  events:
    "submit #add-comment-form": "addCommentHandler"
    "submit .add-followup-form": "addFollowupHandler"
    "click #load-more-comments-cnt": "loadMoreCommentsHandler"

  maps: null

  router: null

  currentUser: null

  profileGeneralInfo: null

  renderProfileWall: true

  postsBatchSize: Kin.CONFIG.postsBatchSize

  initialize: ({@router, @currentUser})->
    @

  render: ()->
    that = @
    $.tmpload
      url: @tplUrl[@model.get("type")]
      onLoad: (tpl)->
        canEdit = that.currentUser.canEditProfile(that.model.get('_id'))
        $(that.el).html(tpl({profile: that.model, canEdit: canEdit, currentUser: that.currentUser}))
        that.$('#profile-main-tabs').doomTabs
          firstSelectedTab: 1
          onSelect: ($selectedTab)->
            if $selectedTab.attr('id') is 'profile-view-on-map-tab' and not that.maps
              mapCenterLat = that.model.get('location').lat
              mapCenterLng = that.model.get('location').lng
              that.maps = new window.Kin.GoogleMapsView
                id: '#profile-address-maps'
                mapsOptions:
                  zoom: 16
                  mapTypeId: 'google.maps.MapTypeId.ROADMAP'
                  center: "new google.maps.LatLng(#{mapCenterLat}, #{mapCenterLng})"
              that.maps.render()
              that.addAddressMarker(mapCenterLat, mapCenterLng, that.model.get('name'))

        if not that.profileGeneralInfo
          that.profileGeneralInfo = new Kin.Profile.ProfileGeneralInfoView
            el: that.$('#profile-info-tab')
            model: that.model
            router: that.router
            currentUser: that.currentUser
        that.profileGeneralInfo.render()

        that.$('#profile-gallery-tabs').doomTabs
          onSelect: ($selectedTab)->
        that.$('div.doom-carousel').doomCarousel
          autoSlide: false
          showCaption: false
          slideSpeed: 400
          showCounter: true
        that.$('a[rel^="prettyPhoto"]').prettyPhoto
          slideshow: false
          social_tools: false
          theme: 'light_rounded'
          deeplinking: false
          animation_speed: 0

        that.$("#add-comment-form textarea").autoResize
          extraSpace: -2

        if that.renderProfileWall and not that.profileWall
          that.profileWall = new Kin.Profile.ProfileWallView
            el: that.$('#wall-comments-list')
            model: that.model
            collection: new Kin.WallCommentsCollection([], {profileId: that.model.get("_id")})
            router: that.router
            currentUser: that.currentUser
            loadMoreCommentsCnt: that.$("#load-more-comments-cnt")

    @

  remove: ()->
    if @maps
      @maps.remove()
    @unbind()
    $(@el).unbind().empty()
    if @profileGeneralInfo
      @profileGeneralInfo.remove()
    if @profileWall
      @profileWall.remove()
    @

  addAddressMarker: (lat, lng, name)->
    @addressMarker = @maps.addMarker(lat, lng, name, false)

  addCommentHandler: (ev)->
    ev.preventDefault()
    $form = @$(ev.target)
    @sendCommentFromForm($form)
    $form.find("textarea").val("").keyup()

  addFollowupHandler: (ev)->
    ev.preventDefault()
    $form = @$(ev.target)
    @sendCommentFromForm($form)
    $form.find("textarea").val("").keyup()

  sendCommentFromForm: ($form)->
    that = @
    commentData = $form.serialize()
    comment = new Kin.CommentModel({wall_id: @model.get("_id")})
    comment.save null,
      data: commentData
      success: ()->
        that.profileWall.collection.loadComments()

  loadMoreCommentsHandler: (ev)->
    ev.preventDefault()
    @profileWall.collection.loadComments
      isHistory: true
      success: (collection, models)=>
        statuses = _.filter models, (model)->
          model.type is "status"
        if statuses.length < @postsBatchSize
          $(ev.currentTarget).remove()