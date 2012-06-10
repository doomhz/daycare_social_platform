(function() {
  var RegisterInvite, User;

  RegisterInvite = require('../models/register_invite');

  User = require('../models/user');

  module.exports = function(app) {
    app.get('/register-invites', function(req, res) {
      return RegisterInvite.find().desc("created_at").run(function(err, invites) {
        return res.render('invites/register_invites', {
          title: "Register Invites",
          layout: "guest",
          pageName: "register-invites",
          invites: invites
        });
      });
    });
    return app.post('/register-invites', function(req, res) {
      var data, registerInvite;
      data = req.body;
      registerInvite = new RegisterInvite(data);
      registerInvite.save(function() {
        return registerInvite.send();
      });
      res.writeHead(303, {
        'Location': "/register-invites"
      });
      return res.end();
    });
  };

}).call(this);
