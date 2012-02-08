(function() {

  Kin.Helper.Text = {
    toMarkup: function(text) {
      var link, url, urlPattern, urls, _i, _len;
      urlPattern = /(http:\/\/|https:\/\/|www\.).*?(?=( |\n|$|<br \/>))/gim;
      urls = text.match(urlPattern);
      if (urls) {
        for (_i = 0, _len = urls.length; _i < _len; _i++) {
          url = urls[_i];
          link = '<a href="{url}" target="_blank">{url}</a>'.replace(/\{url\}/gi, url);
          text = text.replace(url, link);
        }
      }
      return text;
    }
  };

}).call(this);
