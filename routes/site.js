(function() {
  var http, querystring;

  http = require('http');

  querystring = require('querystring');

  module.exports = function(app) {
    app.get('/', function(req, res) {
      if (req.user) {
        return res.render('site/index', {
          title: "Kindzy"
        });
      } else {
        return res.render('site/index_guest', {
          title: "Kindzy",
          layout: "auth"
        });
      }
    });
    app.get('/features', function(req, res) {
      return res.render('site/features', {
        title: "Kindzy",
        layout: "auth"
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
          var location, locations, _i, _len, _ref;
          locations = [];
          _ref = jsonData.results;
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            location = _ref[_i];
            locations.push({
              address: location.formatted_address,
              lat: location.geometry.location.lat,
              lng: location.geometry.location.lng
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
