class Kin.Header.SearchView extends Backbone.View

  el: null

  searchAutocompleteUrl: "/profiles/quick-search"

  searchItemAutocompleteTplUrl: "/templates/main/header/quick_search_autocomplete.html"

  router: null

  initialize: ({@router})->

  render: ()->
    $.tmpload
      url: @searchItemAutocompleteTplUrl
      onLoad: (tpl)=>
        @$("[name='q']").autocomplete @searchAutocompleteUrl,
          autoFill: false
          selectFirst: true
          scrollHeight: 400
          width: 371
          max: 15
          resultsClass: "ac_results quick-search-results",
          formatItem: (data)->
            itemHtml = tpl
              profile:
                id: data[0]
                name: data[1]
                surname: data[2]
                avatarUrl: data[3]
                location: data[4]
            itemHtml
          formatResult: (data)->
            data[0]
        .result (ev, data, profileId)=>
          ev.preventDefault()
          $(ev.target).val("")
          @router.navigate("profiles/view/#{profileId}", true)
