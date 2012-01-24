class window.Kin.Header.ProfileInfoView extends Kin.Header.SubmenuView

  model: null

  daycaresListTplUrl: '/templates/main/header/my_daycares_list.html'

  listId: "my-daycares-list"

  initialize: ()->
    super()
    @bind("change", @currentUserChangeHandler)
    @updateProfilePicture()
    @updateProfileUrls()
    @renderDaycaresList()

  currentUserChangeHandler: (attribute, value)->
    if attribute is "picture_sets"
      @updateProfilePicture()
    if attribute is "daycare_friends"
      @renderDaycaresList()

  updateProfilePicture: ()->
    profilePicture = @model.getProfilePicture()
    if profilePicture
      @$("#my-profile-thumb").attr("src", @model.getProfilePicture().thumb_url)

  updateProfileUrls: ()->
    urlIds = ["#my-profile-view-url", "#my-profile-edit-url"]
    for urlId in urlIds
      $url = @$(urlId)
      href = $url.attr("href").replace(":id", @model.get("_id"))
      $url.attr("href", href)

  renderDaycaresList: ()->
    that = @
    daycares = @model.get("daycare_friends")
    $.tmpload
      url: @daycaresListTplUrl
      onLoad: (tpl)->
        $el = that.$("##{that.listId}")
        $el.html(tpl({daycares: daycares}))