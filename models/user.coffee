mongooseAuth = require('mongoose-auth')

UserSchema = new Schema({})

UserSchema.plugin(
  mongooseAuth,
  {
    everymodule:
      everyauth:
        User: ()->
          mongoose.model('User')
    password:
      loginWith: 'email'
      extraParams:
        phone: String
        name:
          first: String
          last: String
      everyauth:
        getLoginPath: '/login'
        postLoginPath: '/login'
        loginView: 'login.jade'
        getRegisterPath: '/register'
        postRegisterPath: '/register'
        registerLayout: 'users.jade'
        registerView: 'users/register.jade'
        loginSuccessRedirect: '/'
        registerSuccessRedirect: '/'
  }
)

exports = module.exports = mongoose.model('User', UserSchema)