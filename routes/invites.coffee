RegisterInvite = require('../models/register_invite')
User = require('../models/user')

module.exports = (app)->

  app.get '/register-invites', (req, res)->
    RegisterInvite.find().desc("created_at").run (err, invites)->
      res.render 'invites/register_invites', {title: "Register Invites", layout: "guest", pageName: "register-invites", invites: invites}

  app.post '/register-invites', (req, res)->
    data = req.body
    registerInvite = new RegisterInvite data
    registerInvite.save ()->
      registerInvite.send()
    res.writeHead(303, {'Location': "/register-invites"})
    res.end()

  app.put '/register-invites', (req, res)->
    data = req.body
    RegisterInvite.findOne({_id: data.invite_id}).run (err, invite)->
      invite.clicks++
      invite.save()
    res.json {success: true}