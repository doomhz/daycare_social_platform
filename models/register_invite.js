(function() {
  var RegisterInvite, RegisterInviteSchema, exports;

  RegisterInviteSchema = new Schema({
    email: {
      type: String
    },
    name: {
      type: String
    },
    surname: {
      type: String
    },
    created_at: {
      type: Date,
      "default": Date.now
    }
  });

  RegisterInviteSchema.methods.send = function() {
    var Emailer, emailer, options;
    options = {
      to: {
        email: this.email,
        name: this.name,
        surname: this.surname
      },
      subject: "Registartion invite from Kindzy",
      template: "register_invite"
    };
    Emailer = require("../lib/emailer");
    emailer = new Emailer(options, this);
    return emailer.send(function(err, result) {
      if (err) return console.log(err);
    });
  };

  RegisterInvite = mongoose.model("RegisterInvite", RegisterInviteSchema);

  exports = module.exports = RegisterInvite;

}).call(this);
