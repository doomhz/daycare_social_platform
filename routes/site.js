(function() {
  var ContactUs, InviteRequest, http, querystring, _,
    __indexOf = Array.prototype.indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  _ = require('underscore');

  http = require('http');

  querystring = require('querystring');

  InviteRequest = require('../models/invite_request');

  ContactUs = require('../models/contact_us');

  module.exports = function(app) {
    app.get('/', function(req, res) {
      if (req.user) {
        return res.render('site/index', {
          title: "Kindzy"
        });
      } else {
        return res.render('site/index_guest', {
          title: "Kindzy",
          layout: "guest"
        });
      }
    });
    app.post('/request-invite', function(req, res) {
      var data, inviteRequest;
      data = req.body;
      inviteRequest = new InviteRequest(data);
      inviteRequest.save(function() {
        return inviteRequest.send();
      });
      return res.json({
        success: true
      });
    });
    app.get('/token-error', function(req, res) {
      return res.render('site/token_error', {
        title: "Kindzy",
        layout: "auth"
      });
    });
    app.get('/features', function(req, res) {
      return res.render('site/features', {
        title: "Kindzy",
        layout: "guest",
        pageName: "features"
      });
    });
    app.get('/about-us', function(req, res) {
      return res.render('site/about_us', {
        title: "Kindzy",
        layout: "guest",
        pageName: "about-us"
      });
    });
    app.get('/terms', function(req, res) {
      return res.render('site/terms', {
        title: "Kindzy",
        layout: "guest",
        pageName: "terms"
      });
    });
    app.get('/privacy', function(req, res) {
      return res.render('site/privacy', {
        title: "Kindzy",
        layout: "guest",
        pageName: "privacy"
      });
    });
    app.get('/contact-us', function(req, res) {
      var currentUser;
      currentUser = req.user ? req.user : {};
      return res.render('site/contact_us', {
        title: "Kindzy",
        layout: "guest",
        pageName: "contact-us",
        currentUser: currentUser
      });
    });
    app.post('/contact-us', function(req, res) {
      var contactUs, data;
      data = req.body;
      contactUs = new ContactUs(data);
      contactUs.save(function() {
        return contactUs.send({
          host: req.headers.host
        });
      });
      return res.json({
        success: true
      });
    });
    return app.get('/geolocation', function(req, res) {
      var options, q;
      q = req.query.q;
      options = {
        host: 'maps.googleapis.com',
        port: 80,
        path: "/maps/api/geocode/json?" + (querystring.stringify({
          address: q
        })) + "&sensor=false"
      };
      return http.get(options, function(res2) {
        var extractLocationsFromJson, jsonData, rawData;
        rawData = '';
        jsonData = '';
        extractLocationsFromJson = function(jsonData) {
          var addressComponent, address_components, location, locations, _i, _j, _len, _len2, _ref, _ref2;
          locations = [];
          _ref = jsonData.results;
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            location = _ref[_i];
            address_components = {};
            _ref2 = location.address_components;
            for (_j = 0, _len2 = _ref2.length; _j < _len2; _j++) {
              addressComponent = _ref2[_j];
              if (__indexOf.call(addressComponent.types, "locality") >= 0) {
                address_components.city = addressComponent.long_name;
              } else if (__indexOf.call(addressComponent.types, "administrative_area_level_2") >= 0) {
                address_components.county = addressComponent.long_name;
              } else if (__indexOf.call(addressComponent.types, "administrative_area_level_1") >= 0) {
                address_components.state = addressComponent.long_name;
                address_components.state_code = addressComponent.short_name;
              } else if (__indexOf.call(addressComponent.types, "country") >= 0) {
                address_components.country = addressComponent.long_name;
              } else if (__indexOf.call(addressComponent.types, "postal_code") >= 0) {
                address_components.zip_code = addressComponent.long_name;
              }
            }
            locations.push({
              address: location.formatted_address,
              lat: location.geometry.location.lat,
              lng: location.geometry.location.lng,
              address_components: address_components
            });
          }
          return locations;
        };
        res2.setEncoding('utf8');
        res2.on('data', function(chunk) {
          return rawData += chunk;
        });
        return res2.on('end', function() {
          var locations;
          jsonData = null;
          locations = null;
          try {
            jsonData = JSON.parse(rawData);
            locations = extractLocationsFromJson(jsonData);
          } catch (e) {
            console.log('Error parsing location string to JSON: ' + rawData);
            console.log(e);
          }
          return res.render('site/geolocation', {
            layout: false,
            locations: locations
          });
        });
      }).on('error', function(e) {
        console.log("Got error: " + e.message);
        return res.render('site/geolocation', {
          layout: false,
          error: true
        });
      });
    });
  };

}).call(this);
