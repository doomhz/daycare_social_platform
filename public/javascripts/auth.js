(function() {

  $(function() {
    var friendRequestId, searchStart;
    $("#show-password").click(function(ev) {
      var $pwdEl;
      ev.preventDefault();
      $(".password-fields").each(function(index, el) {
        var $clone, $el, newType;
        $el = $(el);
        $clone = $el.clone();
        newType = $el.attr("type") === "text" ? "password" : "text";
        $clone.attr("type", newType);
        return $el.replaceWith($clone);
      });
      $pwdEl = $(ev.target);
      if ($pwdEl.text() === $pwdEl.data("show")) {
        return $pwdEl.text($pwdEl.data("hide"));
      } else {
        return $pwdEl.text($pwdEl.data("show"));
      }
    });
    friendRequestId = $("input[name='friend_request_id']").val();
    if (friendRequestId || (searchStart = window.document.location.search.search(/friend_request=.*/) > -1)) {
      friendRequestId = friendRequestId || window.document.location.search.substring(searchStart).replace("friend_request=", "");
      $.getJSON("/friend-request/" + friendRequestId, function(response) {
        if (response._id === friendRequestId && response.status === "sent") {
          $("input[type='radio'][value='" + response.type + "']").attr("checked", true).click();
          $("input[name='name']").val(response.name);
          $("input[name='surname']").val(response.surname);
          $("input[name='email']").val(response.email);
          return $("input[name='friend_request_id']").val(response._id);
        }
      });
    }
    $("input[name='type']&&input[value='parent']").click(function(ev) {
      if ($(ev.target).attr("checked")) {
        $("input[name='surname']").removeClass("hidden");
        $("label[for='name']").text("Name");
        return $("input[name='name']").removeClass("large");
      }
    });
    $("input[name='type']&&input[value='staff']").click(function(ev) {
      if ($(ev.target).attr("checked")) {
        $("input[name='surname']").removeClass("hidden");
        $("label[for='name']").text("Name");
        return $("input[name='name']").removeClass("large");
      }
    });
    return $("input[name='type']&&input[value='daycare']").click(function(ev) {
      if ($(ev.target).attr("checked")) {
        $("input[name='surname']").addClass("hidden");
        $("label[for='name']").text("Daycare name");
        return $("input[name='name']").addClass("large");
      }
    });
  });

}).call(this);
