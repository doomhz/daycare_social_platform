(function() {
  var ContactUs, ContactUsSchema, exports;

  ContactUsSchema = new Schema({
    user_id: {
      type: String
    },
    email: {
      type: String
    },
    name: {
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

  ContactUsSchema.methods.send = function(options) {
    var Emailer, data, emailer, profileUrl, siteUrl;
    siteUrl = "http://" + options.host;
    profileUrl = this.user_id ? "" + siteUrl + "/#profiles/view/" + this.user_id : "";
    data = {
      "user_id": this.user_id,
      "name": this.name,
      "surname": this.surname,
      "email": this.email,
      "message": this.message,
      "profile_url": profileUrl
    };
    options = {
      to: {
        email: "help@kindzy.com",
        name: "Kindzy",
        surname: "Help"
      },
      subject: "Contact Us message from Kindzy.com",
      template: "contact_us"
    };
    Emailer = require("../lib/emailer");
    emailer = new Emailer(options, data);
    return emailer.send(function(err, result) {
      if (err) return console.log(err);
    });
  };

  ContactUs = mongoose.model("ContactUs", ContactUsSchema);

  exports = module.exports = ContactUs;

}).call(this);
