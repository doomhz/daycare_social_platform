Kin.Helper.Text =

  toMarkup: (text)->
    text = text.replace(/&apos;/gim, "&#39")
    urlPattern = /(http:\/\/|https:\/\/|www\.).*?(?=( |\n|$|<br \/>))/gim
    urls = text.match(urlPattern)
    if urls
      for url in urls
        linkUrl = url.replace(/^www/, "http://www")
        link = '<a href="{linkUrl}" target="_blank">{url}</a>'.replace(/\{linkUrl\}/gi, linkUrl).replace(/\{url\}/gi, url)
        text = text.replace(url, link)
    text

  truncate: (text, limit = 30, placeholder = "...")->
  	if text.length > limit
  		text = text.substr(0, limit) + placeholder
  	text

