(function() {
  var InviteRequest, InviteRequestSchema, exports;

  InviteRequestSchema = new Schema({
    email: {
      type: String
    },
    message: {
      type: String
    },
    created_at: {
      type: Date,
      "default": Date.now
    }
  });

  InviteRequestSchema.methods.send = function() {
    var Emailer, data, emailer, options;
    data = {
      "email": this.email,
      "message": this.message
    };
    options = {
      to: {
        email: "help@kindzy.com",
        name: "Kindzy",
        surname: "Help"
      },
      subject: "Invite requested on Kindzy.com",
      template: "request_invite"
    };
    Emailer = require("../lib/emailer");
    emailer = new Emailer(options, data);
    return emailer.send(function(err, result) {
      if (err) return console.log(err);
    });
  };

  InviteRequest = mongoose.model("InviteRequest", InviteRequestSchema);

  exports = module.exports = InviteRequest;

}).call(this);
