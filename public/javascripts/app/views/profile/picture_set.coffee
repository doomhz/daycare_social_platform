class window.Kin.Profile.PictureSetView extends Backbone.View

  el: null

  tplUrl: '/templates/main/profile/picture_set.html'

  uploader: null

  currentUser: null

  initialize: ({@currentUser})->
    @model and @model.view = @
    @

  render: ()->
    that = @
    $.tmpload
      url: @tplUrl
      onLoad: (tpl)->
        $el = $(that.el)
        canEdit = that.currentUser.canEditProfile(that.model.get('user_id'))
        $el.html(tpl({pictureSet: that.model, canEdit: canEdit}))

        if not that.picturesListView
          that.picturesListView = new Kin.Profile.PicturesListView
            el: that.$('#pictures-list')
            collection: that.model.pictures
            currentUser: that.currentUser
            canEdit: canEdit
        that.picturesListView.render()

        if canEdit
          that.uploader = new qq.FileUploader
            element: document.getElementById('picture-uploader')
            action: '/profiles/upload'
            debug: false
            uploadButtonText: if that.model.get('type') is 'profile' then 'add profile picture' else 'add photos'
            template: '<div class="qq-uploader">' +
                '<div class="qq-upload-drop-area"><span>Drop files here to upload</span></div>' +
                '<div class="qq-upload-button primary btn">{uploadButtonText}</div>' +
                '<ul class="qq-upload-list"></ul>' +
             '</div>',
            onSubmit: (id, fileName)->
              that.uploader.setParams
                setId: that.model.get('_id')
            onComplete: (id, fileName, responseJSON)->
              that.model.pictures.add(responseJSON)
              Kin.app.pub "picture_set:step", "added_profile_picture" if that.model.get("type") is "profile"

          that.$('#picture-set-text-edit').doomEdit
            ajaxSubmit: false
            submitOnBlur: true
            submitBtn: false
            cancelBtn: false
            afterFormSubmit: (data, form, $el)->
              $el.text(data)
              that.model.save({name: data}, {silent: true})

          that.$('#picture-set-type-select').doomEdit
            ajaxSubmit: false
            autoDisableBt: false
            submitOnBlur: true
            submitBtn: false
            cancelBtn: false
            editField: '<select name="setTypeSelect"><option value="public">Public</option><option value="default">Private</option></select>'
            onStartEdit: ($form, $elem)->
              $form.find('select').val($elem.data('type'))
            afterFormSubmit: (data, $form, $el)->
              $el.text($form.find('select >option:selected').text())
              $el.data('type', data)
              that.model.save({type: data}, {silent: true})
    @

  remove: ()->
    $el = $(@el)
    @unbind()
    $el.unbind().empty()
    @picturesListView.remove()
    @