Kin.Helper.Text =

  toMarkup: (text)->
    urlPattern = /(http:\/\/|https:\/\/|www\.).*?(?=( |\n|$|<br \/>))/gim
    urls = text.match(urlPattern)
    if urls
      for url in urls
        linkUrl = url.replace(/^www/, "http://www")
        link = '<a href="{linkUrl}" target="_blank">{url}</a>'.replace(/\{linkUrl\}/gi, linkUrl).replace(/\{url\}/gi, url)
        text = text.replace(url, link)
    text
