http = require('http')
querystring = require('querystring')
InviteRequest = require('../models/invite_request')

module.exports = (app)->

  app.get '/', (req, res)->
    if req.user
      res.render 'site/index', {title: "Kindzy"}
    else
      res.render 'site/index_guest', {title: "Kindzy", layout: "guest"}

  app.post '/request-invite', (req, res)->
    data = req.body
    inviteRequest = new InviteRequest data
    inviteRequest.save()
    res.json {success: true}

  app.get '/token-error', (req, res)->
    res.render 'site/token_error', {title: "Kindzy", layout: "auth"}

  app.get '/features', (req, res)->
    res.render 'site/features', {title: "Kindzy", layout: "guest", pageName: "features"}

  app.get '/about-us', (req, res)->
    res.render 'site/about_us', {title: "Kindzy", layout: "guest", pageName: "about-us"}

  app.get '/terms', (req, res)->
    res.render 'site/terms', {title: "Kindzy", layout: "guest", pageName: "terms"}

  app.get '/privacy', (req, res)->
    res.render 'site/privacy', {title: "Kindzy", layout: "guest", pageName: "privacy"}

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
