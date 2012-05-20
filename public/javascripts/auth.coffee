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

  if $("input[name='password_confirm']").length
    $("#register-form").validate
      rules:
        password_confirm:
          equalTo: "#password"
      messages:
        password_confirm:
          equalTo: "Passwords do not match."
      errorPlacement: (error, element)->
        error.appendTo(element.parent())

  if $("#login-form").length
    $("#login-form").validate()

  if $("#send-pass-form").length
    $("#send-pass-form").validate()

  friendRequestId = $("input[name='friend_request_id']").val()
  if friendRequestId or (searchStart = window.document.location.search.search(/friend_request=.*/) > -1)
    $("#register-as").addClass("hidden")
    friendRequestId = friendRequestId or window.document.location.search.substring(searchStart).replace("friend_request=", "")
    $.getJSON "/friend-request/" + friendRequestId, (response)->
      loginFormUrl = "/login?friend_request=#{friendRequestId}"
      if response._id
        if response._id is friendRequestId and response.user.id and window.document.location.href.search("/login") is -1
          window.document.location = loginFormUrl
        $("#login-form").attr("action", loginFormUrl)
        if response._id is friendRequestId and response.status is "pending"
          $("input[type='radio'][value='#{response.type}']").attr("checked", true).click()
          $("input[name='name']").val(response.name)
          $("input[name='surname']").val(response.surname)
          $("input[name='email']").val(response.email)
          $("input[name='friend_request_id']").val(response._id)
      else
        $('#token-error-cnt').removeClass("hidden")

  $("input[name='type']&&input[value='parent']").click (ev)->
    if $(ev.target).attr("checked")
      $("input[name='surname']").removeClass("hidden")
      $("label[for='name']").text("First and last name")
      $("input[name='name']").removeClass("large")

  $("input[name='type']&&input[value='staff']").click (ev)->
    if $(ev.target).attr("checked")
      $("input[name='surname']").removeClass("hidden")
      $("label[for='name']").text("First and last name")
      $("input[name='name']").removeClass("large")

  $("input[name='type']&&input[value='daycare']").click (ev)->
    if $(ev.target).attr("checked")
      $("input[name='surname']").addClass("hidden")
      $("label[for='name']").text("Daycare name")
      $("input[name='name']").addClass("large")

  if window.location.search.search("msg=pass-changed") > -1
    $("#pass-changed-msg").removeClass("hidden")

  $("#open-login-link").click (ev)->
    ev.preventDefault()
    dWindow $("div.login-wrapper").html(),
      wrapperId: "log-in-window"
    $("#login-form", "#log-in-window").validate()

  $("#request-invite-link").click (ev)->
    ev.preventDefault()
    dWindow $("div.invite-wrapper").html(),
      wrapperId: "invite-window"
    $inviteForm = $("#invite-form", "#invite-window")
    $inviteForm.validate()
    $inviteForm.submit (ev)->
      ev.preventDefault()
      if $inviteForm.valid()
        $.ajax
          url: $inviteForm.attr("action")
          type: $inviteForm.attr("method")
          data: $inviteForm.serialize()
          success: ()->
            $inviteForm.remove()
            $("#invite-sent-success", "#invite-window").removeClass("hidden")

  if $("#testimonials-scroller").length
    $testimonialsButtons = $("#testimonials-scroller").children()
    $testimonials = $(".testimonial", "#testimonials-cnt")
    $testimonialsButtons.click (ev)->
      ev.preventDefault()
      $el = $(ev.currentTarget)
      switchTestimonial($el)
      if testimonialsIntervalId
        clearInterval(testimonialsIntervalId)
    switchTestimonial = ($el)->
      index = $el.data("index")
      $testimonials.addClass("hidden")
      $($testimonials[index]).removeClass("hidden")
      $testimonialsButtons.removeClass("selected")
      $el.addClass("selected")
    scrollTestimonials = ()->
      index = $testimonialsButtons.filter(".selected:first").data("index")
      console.log index
      index++
      if index > $testimonials.length - 1
        index = 0
      switchTestimonial($($testimonialsButtons[index]))
    testimonialsIntervalId = setInterval(scrollTestimonials, 3000)

  if $("#features-menu").length
    $featuresMenuItems = $("#features-menu").children()
    $featuresMenuItems.click (ev)->
      $el = $(ev.currentTarget)
      $featuresMenuItems.removeClass("selected")
      $el.addClass("selected")
