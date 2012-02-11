class Kin.HeaderView extends Backbone.View

	el: "header"

	initialize: ()->

	render: ()->
		@showElements(["#main-menu", "#events-menu", "#search-cnt"])
	
	showElements: (elements = [])->
		for element in elements
			@$(element).removeClass("hidden")