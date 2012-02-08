(function() {

  Kin.Helper.Text = {
    toMarkup: function(text) {
      var link, linkUrl, url, urlPattern, urls, _i, _len;
      urlPattern = /(http:\/\/|https:\/\/|www\.).*?(?=( |\n|$|<br \/>))/gim;
      urls = text.match(urlPattern);
      if (urls) {
        for (_i = 0, _len = urls.length; _i < _len; _i++) {
          url = urls[_i];
          linkUrl = url.replace(/^www/, "http://www");
          link = '<a href="{linkUrl}" target="_blank">{url}</a>'.replace(/\{linkUrl\}/gi, linkUrl).replace(/\{url\}/gi, url);
          text = text.replace(url, link);
        }
      }
      return text;
    }
  };

}).call(this);
