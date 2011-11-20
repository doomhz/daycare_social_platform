(function() {
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  };
  window.Kin.MainRouter = (function() {
    __extends(MainRouter, Backbone.Router);
    function MainRouter() {
      MainRouter.__super__.constructor.apply(this, arguments);
    }
    MainRouter.prototype.routes = {
      '': 'root',
      'day-cares': 'dayCares',
      'day-cares/view/:id': 'viewDayCare',
      'day-cares/view/gallery/:id': 'viewDayCareGallery',
      'day-cares/edit/:id': 'editDayCare',
      'day-cares/view/picture-set/:id': 'viewDayCarePictureSet'
    };
    MainRouter.prototype.mainColumnView = null;
    MainRouter.prototype.side1ColumnView = null;
    MainRouter.prototype.initialize = function() {};
    MainRouter.prototype.root = function() {
      this.clearColumns();
      return this.navigate('day-cares', true);
    };
    MainRouter.prototype.dayCares = function() {
      this.clearColumns();
      this.mainColumnView = new window.Kin.DayCare.ListView({
        collection: new window.Kin.DayCareCollection([], {
          url: '/day-cares'
        }),
        el: '#main-column'
      });
      return this.mainColumnView.render();
    };
    MainRouter.prototype.viewDayCare = function(id) {
      var dayCare, that;
      that = this;
      this.clearColumns();
      dayCare = new window.Kin.DayCareModel({
        _id: id
      });
      return dayCare.fetch({
        success: function(model, response) {
          model.setPictureSets();
          that.mainColumnView = new window.Kin.DayCare.ProfileView({
            model: model,
            el: '#main-column'
          });
          that.mainColumnView.render();
          that.side1ColumnView = new window.Kin.DayCare.ProfileSide1View({
            model: model,
            el: '#side-column1'
          });
          return that.side1ColumnView.render();
        }
      });
    };
    MainRouter.prototype.viewDayCareGallery = function(id) {
      var dayCare, that;
      that = this;
      this.clearColumns();
      dayCare = new window.Kin.DayCareModel({
        _id: id
      });
      return dayCare.fetch({
        success: function(model, response) {
          model.setPictureSets();
          that.mainColumnView = new window.Kin.DayCare.ProfileGalleryView({
            model: model,
            el: '#main-column'
          });
          that.mainColumnView.render();
          that.side1ColumnView = new window.Kin.DayCare.ProfileSide1View({
            model: model,
            el: '#side-column1'
          });
          return that.side1ColumnView.render();
        }
      });
    };
    MainRouter.prototype.editDayCare = function(id) {
      var dayCare, that;
      that = this;
      this.clearColumns();
      dayCare = new window.Kin.DayCareModel({
        _id: id
      });
      return dayCare.fetch({
        success: function(model, response) {
          var mapCenterLat, mapCenterLng;
          mapCenterLat = model.get('location').lat;
          mapCenterLng = model.get('location').lng;
          that.mainColumnView = new window.Kin.DayCare.ProfileEditView({
            model: model,
            el: '#main-column',
            maps: new window.Kin.GoogleMapsView({
              id: '#profile-address-maps',
              mapsOptions: {
                zoom: 6,
                mapTypeId: 'google.maps.MapTypeId.ROADMAP',
                center: "new google.maps.LatLng(" + mapCenterLat + ", " + mapCenterLng + ")"
              }
            })
          });
          that.mainColumnView.render();
          that.side1ColumnView = new window.Kin.DayCare.ProfileEditSide1View({
            model: model,
            el: '#side-column1'
          });
          return that.side1ColumnView.render();
        }
      });
    };
    MainRouter.prototype.viewDayCarePictureSet = function(id) {
      var pictureSet, that;
      that = this;
      this.clearColumns();
      pictureSet = new window.Kin.PictureSetModel({
        _id: id
      });
      return pictureSet.fetch({
        success: function(model, response) {
          that.mainColumnView = new window.Kin.DayCare.PictureSetView({
            model: model,
            el: '#main-column'
          });
          that.mainColumnView.render();
          that.side1ColumnView = new window.Kin.DayCare.PictureSetSide1View({
            model: model,
            el: '#side-column1'
          });
          return that.side1ColumnView.render();
        }
      });
    };
    MainRouter.prototype.clearColumns = function(columns) {
      var column, _i, _len, _results;
      if (columns == null) {
        columns = ['main', 'side1'];
      }
      _results = [];
      for (_i = 0, _len = columns.length; _i < _len; _i++) {
        column = columns[_i];
        _results.push(this["" + column + "ColumnView"] && this["" + column + "ColumnView"].remove());
      }
      return _results;
    };
    return MainRouter;
  })();
}).call(this);
