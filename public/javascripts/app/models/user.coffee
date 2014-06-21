class Kin.UserModel extends Backbone.Model

  defaults:
    _id: null
    name: ''
    username: ''
    speaking_classes: []
    address: ''
    location: [0, 0]
    location_components: {}
    email: ''
    phone: ''
    fax: ''
    contact_person: ''
    licensed: false
    license_number: ''
    type: 'daycare'
    opened_since: ''
    open_door_policy: false
    serving_disabilities: false
    picture_sets: []
    flags: []

  url: '/profiles'

  autoUpdate: false

  autoUpdateTime: 2000

  delegates: []

  initialize: (options = {})->
    @url = options.url || @url
    @autoUpdate = options.autoUpdate || @autoUpdate
    @autoUpdateTime = options.autoUpdateTime || @autoUpdateTime
    if @autoUpdate
      window.setInterval(@autoUpdateHandler, @autoUpdateTime)
    @bind "change", @dataUpdateHandler
    @bind "profile:step", @setFlag
    @bind "profile_edit:step", @setFlag
    @bind "picture_set:step", @setFlag
    @bind "manage_children:step", @setFlag
    @bind "add_class:step", @setFlag
    @bind "invites:step", @setFlag

  autoUpdateHandler: ()=>
    @fetch()

  fetch: (options = {})->
    options = $.extend {
        error: (model, xhr, error)->
          if xhr.status is 401
            window.location = '/login'
      }, options
    super(options)

  canEditProfile: (profileId)->
    profileId is @get('_id') or (@get("type") is "daycare" and profileId in @get("friends"))

  getProfilePicture: ()->
    profilePictureSet = @getProfilePictureSet(@get('picture_sets'))
    profilePicture = @getPrimaryPictureFromSet(profilePictureSet)

  getProfilePictureSet: (pictureSets = @get('picture_sets'))->
    @getSetsByType(pictureSets, 'profile')[0]

  getPrimaryPictureFromSet: (set = {pictures: []})->
    $.grep(set.pictures, (picture)->
      return picture.primary is true
    )[0]

  getPublicSets: ()->
    sets = @getSetsByType(@get('picture_sets'), 'public')

  getDefaultSets: ()->
    sets = @getSetsByType(@get('picture_sets'), 'default')

  getSetsByType: (pictureSets, type = 'default')->
    $.grep(pictureSets, (set)->
      return set.type is type
    )

  getFirstDaycareFriend: ()->
    @get("daycare_friends")[0]

  hasFlag: (name)=>
    @get("flags").indexOf(name) > -1

  setFlag: (name)=>
    if not @hasFlag(name)
      flags = @get("flags")
      flags.push(name)
      profile = new Kin.ProfileModel
      profile.attributes =
        flags: flags
      profile.set
        _id: @id
        id: @id
      profile.save null,
        success: ()=>
          @set
            flags: flags
          Kin.app.pub "profile:flag", name

  addDelegate: (delegate)->
    if not @delegates[delegate]
      @delegates.push(delegate)

  removeDelegate: (delegateToRemove)->
    @delegates = _.filter @delegates, (delegate)->
      delegate isnt delegateToRemove

  dataUpdateHandler: ()->
    changedAttributes = @changedAttributes()
    for attribute of changedAttributes
      @triggerChangeEventOnDelegates(attribute)

  triggerChangeEventOnDelegates: (changedAttribute)->
    changedAttributeValue = @get(changedAttribute)
    for delegate in @delegates
      delegate.trigger("change", changedAttribute, changedAttributeValue)
