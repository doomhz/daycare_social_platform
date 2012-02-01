$ ()->
  $("#show-password").click (ev)->
    ev.preventDefault()
    $(".password-fields").each (index, el)->
      $el = $(el)
      $clone = $el.clone()
      newType = if $el.attr("type") is "text" then "password" else "text"
      $clone.attr("type", newType)
      $el.replaceWith($clone)

    $pwdEl = $(ev.target)
    if $pwdEl.text() is $pwdEl.data("show")
      $pwdEl.text($pwdEl.data("hide"))
    else
      $pwdEl.text($pwdEl.data("show"))

  friendRequestId = $("input[name='friend_request_id']").val()
  if friendRequestId or (searchStart = window.document.location.search.search(/friend_request=.*/) > -1)
    friendRequestId = friendRequestId or window.document.location.search.substring(searchStart).replace("friend_request=", "")
    $.getJSON "/friend-requests/" + friendRequestId, (response)->
      if response._id is friendRequestId and response.status is "sent"
        $("input[type='radio'][value='parent']").attr("checked", true).click()
        $("input[name='name']").val(response.name)
        $("input[name='surname']").val(response.surname)
        $("input[name='email']").val(response.email)
        $("input[name='friend_request_id']").val(response._id)

  $("input[name='type']&&input[value='parent']").click (ev)->
    if $(ev.target).attr("checked")
      $("input[name='surname']").removeClass("hidden")
      $("label[for='name']").text("Name")
      $("input[name='name']").removeClass("large")

  $("input[name='type']&&input[value='daycare']").click (ev)->
    if $(ev.target).attr("checked")
      $("input[name='surname']").addClass("hidden")
      $("label[for='name']").text("Daycare name")
      $("input[name='name']").addClass("large")
