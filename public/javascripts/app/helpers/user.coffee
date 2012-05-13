Kin.Helper.User =

  getInitialFromGender: (gender)->
    switch gender
      when "female" then "Ms."
      when "mrs" then "Mrs."
      else "Mr."
