class window.Kin.MainRouter extends Backbone.Router

  routes:
    ''         : 'root'
    'day-cares': 'dayCares'
    'day-cares/view/:id': 'viewDayCare'
    'day-cares/edit/:id': 'editDayCare'

  mainColumnView: null

  side1ColumnView: null

  initialize: ()->

  root: ()->
    @clearColumns()
    @navigate('day-cares', true)

  dayCares: ()->
    @clearColumns()
    @mainColumnView = new window.Kin.DayCare.ListView
      collection: new window.Kin.DayCareCollection([], {url: '/day-cares'})
      el: '#main-column'
    @mainColumnView.render()

  viewDayCare: (id)->
    that = @
    @clearColumns()
    dayCare = new window.Kin.DayCareModel({_id: id})
    dayCare.fetch
      success: (model, response)->

        that.mainColumnView = new window.Kin.DayCare.ProfileView
          model: model
          el: '#main-column'
        that.mainColumnView.render()

        that.side1ColumnView = new window.Kin.DayCare.ProfileSide1View
          model: model
          el: '#side-column1'
        that.side1ColumnView.render()

  editDayCare: (id)->
    that = @
    @clearColumns()
    dayCare = new window.Kin.DayCareModel({_id: id})
    dayCare.fetch
      success: (model, response)->

        mapCenterLat = model.get('location').lat or '1'
        mapCenterLng = model.get('location').lng or '1'

        that.mainColumnView = new window.Kin.DayCare.ProfileEditView
          model: model
          el: '#main-column'
          maps: new window.Kin.GoogleMapsView
            id: '#profile-address-maps'
            mapsOptions:
              zoom: 6
              mapTypeId: 'google.maps.MapTypeId.ROADMAP'
              center: "new google.maps.LatLng(#{mapCenterLat}, #{mapCenterLng})"
            mapsCallback: 'Kin.router.mainColumnView.loadGoogleMaps'
        that.mainColumnView.render()

        that.side1ColumnView = new window.Kin.DayCare.ProfileEditSide1View
          model: model
          el: '#side-column1'
        that.side1ColumnView.render()

  clearColumns: (columns = ['main', 'side1'])->
    (@["#{column}ColumnView"] and @["#{column}ColumnView"].remove()) for column in columns



