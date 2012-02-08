Kin.Helper.Text =

  toMarkup: (text)->
    urlPattern = /(http:\/\/|https:\/\/|www\.).*?(?=( |\n|$|<br \/>))/gim
    urls = text.match(urlPattern)
    if urls
      for url in urls
        link = '<a href="{url}" target="_blank">{url}</a>'.replace(/\{url\}/gi, url)
        text = text.replace(url, link)
    text
