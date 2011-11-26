class Kin.DayCare.ProfileGalleryView extends Kin.DayCare.ProfileView

  tplUrl: '/templates/main/day_care/profile_gallery.html'

  events:
    'click #show-new-pic-set-form-bt': 'openNewPicSetForm'
    'click #cancel-new-pic-set-bt'   : 'closeNewPicSetForm'
    'submit #create-new-pic-cnt'     : 'submitCreateNewPicSetForm'
    'click .delete-pic-set-bt'       : 'deletePictureSet'

  initialize: ({@router})->
    _.bindAll @, 'render'

  openNewPicSetForm: (ev)->
    @$('#show-new-pic-set-form-bt').addClass('hidden')
    @$('#create-new-pic-cnt').removeClass('hidden')

  closeNewPicSetForm: (ev)->
    @$('#show-new-pic-set-form-bt').removeClass('hidden')
    @$('#create-new-pic-cnt').addClass('hidden')

  submitCreateNewPicSetForm: (ev)->
    ev.preventDefault()
    newPicSetName = @$(ev.target).find('input[name="new-pic-set-name"]').val()
    newPicSetType = @$(ev.target).find('select[name="new-pic-set-type"]').val()
    pictureSet = new Kin.PictureSetModel
      name: newPicSetName
      type: newPicSetType
    @model.pictureSets.add(pictureSet)
    that = @
    @model.save null,
      success: (model, response)->
        model.fetch
          success: (newModel)->
            model.setPictureSets()
            that.render()

  deletePictureSet: (ev)->
    ev.preventDefault()
    $delBt = @$(ev.target)
    picSetId = $delBt.data('pic-set-id')
    pictureSet = @model.pictureSets.find (model)->
      model.get('_id') is picSetId
    that = @
    pictureSet.destroy
      success: ()->
        that.render()