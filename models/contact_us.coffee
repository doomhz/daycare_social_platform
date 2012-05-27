ContactUsSchema = new Schema
  user_id:
    type: String
  email:
    type: String
  name:
    type: String
  message:
    type: String
  created_at:
    type: Date
    default: Date.now

ContactUsSchema.methods.send = (options)->
  siteUrl = "http://#{options.host}"
  profileUrl = if @user_id then "#{siteUrl}/#profiles/view/#{@user_id}" else ""
  data =
    "user_id": @user_id
    "name": @name
    "surname": @surname
    "email": @email
    "message": @message
    "profile_url": profileUrl
  options =
    to:
      email: "help@kindzy.com"
      name: "Kindzy"
      surname: "Help"
    subject: "Contact Us message from Kindzy.com"
    template: "contact_us"
  Emailer = require "../lib/emailer"
  emailer = new Emailer options, data
  emailer.send (err, result)->
    if err
      console.log err

ContactUs = mongoose.model("ContactUs", ContactUsSchema)
exports = module.exports = ContactUs