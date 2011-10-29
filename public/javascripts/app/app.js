(function() {
  $.tmpload({
    url: '/templates/main/day_care/list_item.html'
  });
  $(function() {
    window.Kin.router = new window.Kin.MainRouter();
    return Backbone.history.start({
      pushState: false
    });
  });
}).call(this);
