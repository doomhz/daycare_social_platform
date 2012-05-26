User          = require('../models/user')
FriendRequest = require('../models/friend_request')
_             = require('underscore')

module.exports = (app)->

  app.post '/friend-request', (req, res)->
    currentUser = if req.user then req.user else {}
    data = req.body
    data.from_id = currentUser._id

    FriendRequest.findOne({email: data.email, from_id: data.from_id}).run (err, friendRequest)->
      if not friendRequest
        friendRequest = new FriendRequest(data)
        friendRequest.save()
        FriendRequest.sendMail(friendRequest, {host: req.headers.host})
      res.json {success: true}

  app.put '/friend-request/:id', (req, res)->
    friendRequestId = req.params.id
    currentUser = if req.user then req.user else {}
    data = req.body
    delete data._id
    data.from_id = currentUser._id

    FriendRequest.findOne({_id: friendRequestId}).run (err, friendRequest)->
      if friendRequest
        friendRequest.set(data)
        friendRequest.save ()->
          if friendRequest.status is "accepted" and friendRequest.user_id
            User.findOne({_id: friendRequest.user_id}).run (err, requestUser)->
              User.find().where("_id").in(requestUser.friends).run (err, userFriends)->
                for userFriend in userFriends
                  userFriend.friends = _.filter userFriend.friends, (friendId)->
                    friendId isnt "#{requestUser._id}"
                  userFriend.save()
                requestUser.friends = []
                requestUser.children_ids = []
                requestUser.save()
                FriendRequest.updateFriendship(requestUser._id)

      res.json {success: true}

  app.put '/friend-request/send/:id', (req, res)->
    friendRequestId = req.params.id
    FriendRequest.findOne({_id: friendRequestId}).run (err, friendRequest)->
      if friendRequest
        FriendRequest.sendMail(friendRequest, {host: req.headers.host})
      res.json {success: true}

  app.put '/friend-request/cancel/:id', (req, res)->
    friendRequestId = req.params.id
    currentUser = if req.user then req.user else {}

    FriendRequest.findOne({_id: friendRequestId}).run (err, friendRequest)->
      if friendRequest
        if friendRequest.status is "accepted" and friendRequest.user_id
          User.findOne({_id: friendRequest.user_id}).run (err, requestUser)->
            User.find().where("_id").in(requestUser.friends).run (err, userFriends)->
              for userFriend in userFriends
                userFriend.friends = _.filter userFriend.friends, (friendId)->
                  friendId isnt "#{requestUser._id}"
                userFriend.save()
              requestUser.friends = []
              requestUser.daycare_friends = []
              requestUser.save()
        friendRequest.set
          status: "canceled"
        friendRequest.save ()->
          res.json {success: true}
      else
        res.json {success: true}

  app.put '/friend-request/activate/:id', (req, res)->
    friendRequestId = req.params.id
    currentUser = if req.user then req.user else {}

    FriendRequest.findOne({_id: friendRequestId}).run (err, friendRequest)->
      if friendRequest
        if friendRequest.user_id
          friendRequest.set
            status: "accepted"
        else
          friendRequest.set
            status: "pending"
        friendRequest.save ()->
          if friendRequest.status is "accepted"
            FriendRequest.updateFriendship friendRequest.user_id, ()->
              res.json {success: true}
          else
            res.json {success: true}
      else
        res.json {success: true}

  app.get '/friend-requests/:type', (req, res)->
    currentUser = if req.user then req.user else {}
    type = req.params.type or "parent"

    FriendRequest.find({from_id: currentUser._id, type: type}).run (err, friendRequests)->
      res.render 'friend_requests/friend_requests', {friend_requests: friendRequests, show_private: false, layout: false}

  app.get '/friend-request/:id', (req, res)->
    friendRequestId = req.params.id
    FriendRequest.findOne({_id: friendRequestId}).run (err, friendRequest)->
      if friendRequest
        User.findOne({email: friendRequest.email}).run (err, user)->
          if user
            friendRequest.user = user
          res.render 'friend_requests/_friend_request', {friend_request: friendRequest, show_private: false, layout: false}
      else
        res.json {}

  app.del '/friend-request/:id', (req, res)->
    friendRequestId = req.params.id
    currentUser = if req.user then req.user else {}

    FriendRequest.findOne({_id: friendRequestId}).run (err, friendRequest)->
      if friendRequest
        if friendRequest.status is "accepted" and friendRequest.user_id
          User.findOne({_id: friendRequest.user_id}).run (err, requestUser)->
            User.find().where("_id").in(requestUser.friends).run (err, userFriends)->
              for userFriend in userFriends
                userFriend.friends = _.filter userFriend.friends, (friendId)->
                  friendId isnt "#{requestUser._id}"
                userFriend.save()
              requestUser.remove()
        friendRequest.remove()

      res.json {success: true}
