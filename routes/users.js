(function() {
  module.exports = function(app) {
    app.get('/home', function(req, res) {
      return res.render('users/home', {
        layout: 'users'
      });
    });
    return app.get('/logout', function(req, res) {
      req.logout();
      return res.redirect('users/home', {
        layout: 'users'
      });
    });
  };
}).call(this);
