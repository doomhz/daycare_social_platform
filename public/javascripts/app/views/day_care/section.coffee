class Kin.DayCare.SectionView extends Backbone.View
	el: null

	tplUrl: '/templates/main/day_care/{sectionName}.html'

	model: null

	currentUser: null

	initialize: (options)->
		@currentUser = options.currentUser

	render: ()->
		that = @
		tplUrl = @tplUrl.replace("{sectionName}", @model.get("name")).replace(/-/g, "_")
		$.tmpload
			url: tplUrl
			onLoad: (tpl)->
				that.model.fetch
					success: (model)->
						$(that.el).html(tpl({section: model}))

	remove: ()->
		@unbind()
		$(@el).unbind().empty()