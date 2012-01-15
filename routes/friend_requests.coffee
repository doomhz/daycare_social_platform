User = require('../models/user')
FriendRequest = require('../models/friend_request')

module.exports = (app)->

  app.post '/friend-requests', (req, res)->
    currentUser = if req.user then req.user else {}
    data = req.body
    data.from_id = currentUser._id

    FriendRequest.findOne({email: data.email, from_id: data.from_id}).run (err, friendRequest)->
      if not friendRequest
        friendRequest = new FriendRequest(data)
        friendRequest.save()
      res.json {success: true}

  app.get '/friend-requests', (req, res)->
    currentUser = if req.user then req.user else {}

    FriendRequest.find({from_id: currentUser._id}).run (err, friendRequests)->
      res.render 'friend_requests/friend_requests', {friend_requests: friendRequests, show_private: false, layout: false}

  app.get '/friend-requests/:id', (req, res)->
    friendRequestId = req.params.id
    FriendRequest.findOne({_id: friendRequestId}).run (err, friendRequest)->
      res.render 'friend_requests/_friend_request', {friend_request: friendRequest, show_private: false, layout: false}