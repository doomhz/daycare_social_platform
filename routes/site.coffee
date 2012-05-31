_ = require('underscore')
http = require('http')
querystring = require('querystring')
InviteRequest = require('../models/invite_request')
ContactUs = require('../models/contact_us')

module.exports = (app)->

  app.get '/', (req, res)->
    if req.user
      res.render 'site/index', {title: "Kindzy"}
    else
      res.render 'site/index_guest', {title: "Kindzy", layout: "guest"}

  app.post '/request-invite', (req, res)->
    data = req.body
    inviteRequest = new InviteRequest data
    inviteRequest.save ()->
      inviteRequest.send()
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

  app.get '/contact-us', (req, res)->
    currentUser = if req.user then req.user else {}
    res.render 'site/contact_us', {title: "Kindzy", layout: "guest", pageName: "contact-us", currentUser: currentUser}

  app.post '/contact-us', (req, res)->
    data = req.body
    contactUs = new ContactUs data
    contactUs.save ()->
      contactUs.send {host: req.headers.host}
    res.json {success: true}

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
          address_components = {}
          for addressComponent in location.address_components
            if "locality" in addressComponent.types
              address_components.city = addressComponent.long_name
            else if "administrative_area_level_2" in addressComponent.types
              address_components.county = addressComponent.long_name
            else if "administrative_area_level_1" in addressComponent.types
              address_components.state = addressComponent.long_name
              address_components.state_code = addressComponent.short_name
            else if "country" in addressComponent.types
              address_components.country = addressComponent.long_name
            else if "postal_code" in addressComponent.types
              address_components.zip_code = addressComponent.long_name

          locations.push
            address: location.formatted_address
            lat: location.geometry.location.lat
            lng: location.geometry.location.lng
            address_components: address_components
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
          console.log e

        res.render 'site/geolocation', {layout: false, locations: locations}
      )

    ).on('error', (e)->
      console.log("Got error: " + e.message)
      res.render 'site/geolocation', {layout: false, error: true}
    )
