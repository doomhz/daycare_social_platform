http = require('http')
querystring = require('querystring')

module.exports = (app)->

  app.get '/', (req, res)->
    res.render 'site/index', {title: "Kindzy.com"}

  # TODO Create a model and cache the location search
  app.get '/geolocation', (req, res)->
    q = req.query.q

    options =
      host: 'maps.googleapis.com'
      port: 80
      path: "/maps/api/geocode/json?#{querystring.stringify({address: q})}&sensor=false"

    http.get(options, (res2)->
      rawData = ''
      jsonData = ''
      extractLocationsFromJson = (jsonData)->
        locations = []
        for location in jsonData.results
          locations.push
            address: location.formatted_address
            lat: location.geometry.location.lat
            lng: location.geometry.location.lng
        locations

      res2.setEncoding('utf8')
      res2.on('data', (chunk)->
        rawData += chunk
      )
      res2.on('end', ()->
        jsonData = null
        locations = null
        try
          jsonData = JSON.parse rawData
          locations = extractLocationsFromJson(jsonData)
        catch e
          console.log('Error parsing location string to JSON: ' + rawData)

        res.render 'site/geolocation', {layout: false, locations: locations}
      )

    ).on('error', (e)->
      console.log("Got error: " + e.message)
      res.render 'site/geolocation', {layout: false, error: true}
    )
  
  app.get '/current-user', (req, res)->
    req.user ?= {}
    User = require('../models/user')
    User.findOne({_id: req.user._id}).run (err, updatedUser)->
      res.json req.user
    