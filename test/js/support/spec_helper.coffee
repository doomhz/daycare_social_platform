fs           = require('fs')
jsdom        = require('jsdom')
coffeescript = require('coffee-script')

INDEX_HTML_PATH = __dirname + '/../../../public/index.html'

helper =
  sinon: require('sinon')

  expandPathToFixture: (relativePath) ->
    __dirname + '/../fixtures/' + relativePath

  setupWindow: () ->
    testeeSourcePaths = [
      'bootstrap'
      'routers/main'
    ]
    html = '<html><head></head><body></body></html>'
    scripts = [
      __dirname + '/../../../public/javascripts/vendor/coffee-script-1.1.2.js'
      __dirname + '/../../../public/javascripts/vendor/jquery.min.js'
      __dirname + '/../../../public/javascripts/vendor/underscore-min.js'
      __dirname + '/../../../public/javascripts/vendor/backbone-min.js'
      __dirname + '/../../../public/javascripts/vendor/jquery.tmpload-3.0.js'
    ]

    testeeSources = []
    testeeSourcePaths.forEach((path) ->
      path = __dirname + '/../../../public/javascripts/app/' + path
      path += '.coffee' if (!/\.coffee$/i.test(path))
      testeeCoffeeScriptSource = '' + fs.readFileSync(path)
      testeeSource = coffeescript.compile(testeeCoffeeScriptSource)
      testeeSources.push(testeeSource)
    )
    configuration =
      html:    html
      scripts: scripts
      src:     testeeSources
      done:    (errors, newWindow) ->
        global.jQuery = newWindow.jQuery
        global.$      = newWindow.$
        require('jasmine-jquery')
        global.window = newWindow # must be last as it releases
                                  # flow control to jasmine

    jsdom.env(configuration)

    beforeEach(() ->
      waitsFor(() ->
        return typeof window isnt "undefined"
      )
      runs(() ->
        global.$('body').empty()
        $.tmpload.templates = []
      )
    )

helper.setupWindow()

module.exports = helper