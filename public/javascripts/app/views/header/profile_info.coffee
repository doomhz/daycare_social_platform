class window.Kin.Header.ProfileInfoView extends Kin.Header.SubmenuView

  model: null

  daycaresListTplUrl: '/templates/main/header/my_daycares_list.html'

  listId: "my-daycares-list"

  initialize: ()->
    super()
    @bind("change", @currentUserChangeHandler)
    @updateProfileName()
    @updateProfileUrls()
    @renderDaycaresList()

  currentUserChangeHandler: (attribute, value)->
    if attribute in ["name", "surname"]
      @updateProfileName()
    if attribute is "daycare_friends"
      @renderDaycaresList()

  updateProfileName: ()->
    profileName = @model.get("name") + " " + @model.get("surname")
    @$("#my-profile-name").text(profileName)

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