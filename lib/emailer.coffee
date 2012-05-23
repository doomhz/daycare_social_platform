email = require("mailer")

class Emailer

  options: {}

  data: {}

  constructor: (@options, @data)->

  send: (callback)->
    email.send({
      host: "smtp.gmail.com"
      port: "587"
      ssl: false
      domain: "localhost"
      to: "'#{@options.to.name} #{@options.to.surname}' <#{@options.to.email}>"
      from: "'Kindzy.com' <no-reply@kindzy.com>"
      subject: @options.subject
      template: "./views/emails/#{@options.template}.html"
      body: "Please use a newer version of an e-mail manager to read this mail in HTML format."
      data: @data
      authentication : "login"
      username : "no-reply@kindzy.com"
      password : "greatreply#69"
    }, callback)

exports = module.exports = Emailer
