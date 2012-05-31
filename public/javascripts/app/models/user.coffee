class Kin.UserModel extends Backbone.Model

  defaults:
    _id: null
    name: ''
    username: ''
    speaking_classes: []
    address: ''
    location: [10, 40]
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
    @bind("change", @dataUpdateHandler)

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
