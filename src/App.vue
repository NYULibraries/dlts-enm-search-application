<template>
    <div id="app">
        <search-form
            :query-u-i="searchForm.queryUI"
            :query-fields-u-i="searchForm.queryFieldsUI"
            @submit="newQuerySubmitted"/>
        <div v-cloak>
            <search-echo
                :display="searchEcho.display"
                :query="searchEcho.query"
                :selected-query-fields-d-c-i-labels="searchEcho.selectedQueryFieldsDCILabels"
                :selected-topic-facet-items="searchEcho.selectedTopicFacetItems"
                @search-dci-dismiss="clearQueryOrChangeToWildcard"
                @topic-dci-dismiss="removeSelectedTopic"
            />
            <div class="container is-fluid">
                <div class="columns enm-panes">
                    <facet-pane
                        :display="facetPane.display"
                        :topics-facet-list="facetPane.topicsFacetList"
                        :topics-facet-list-limit="facetPane.topicsFacetListLimit"
                        @topic-click="addSelectedTopic"
                    />

                    <spinner :display="spinner.display"/>

                    <results-pane
                        :display="resultsPane.display"
                        :num-books="resultsPane.numBooks"
                        :num-pages="resultsPane.numPages"
                        :results="resultsPane.results"
                        @epub-click="setPreviewPane"
                    />
                    <preview-pane
                        :current-search="currentSearch"
                        :display="previewPane.display"
                        :isbn="previewPane.isbn"
                        :title="previewPane.title"
                        @load-first-matched-page-link-click="previewFirstEpub"
                    />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import FacetPane from './components/FacetPane';
import PreviewPane from './components/PreviewPane';
import ResultsPane from './components/ResultsPane';
import SearchEcho from './components/SearchEcho';
import SearchForm from './components/SearchForm';
import Spinner from './components/Spinner';

const QUERY_FIELDS = [
    {
        dciLabel : 'full texts',
        label    : 'Full Text',
        name     : 'fulltext',
        value    : 'pageText',
    },
    {
        dciLabel : 'topics',
        label    : 'Topics',
        name     : 'topics',
        value    : 'topicNames',
    },
];

const QUERY_FIELDS_BY_VALUE = ( function () {
    const queryFieldsByValueMap = {};

    QUERY_FIELDS.forEach( function ( queryField ) {
        queryFieldsByValueMap[ queryField.value ] = queryField;
    } );

    return queryFieldsByValueMap;
} )();

export default {
    name: 'App',
    components : {
        FacetPane,
        PreviewPane,
        ResultsPane,
        SearchEcho,
        SearchForm,
        Spinner,
    },
    data() {
        return {
            currentSearch: {
                query: '',
                queryFields: [],
                selectedTopicFacetItems: [],
            },
            facetPane: {
                display: false,
                topicsFacetList: [],
                topicsFacetListLimit: 15,
            },
            previewPane: {
                display: false,
                isbn: '',
                title: '',
            },
            resultsPane: {
                display: false,
                numBooks: 0,
                numPages: 0,
                results: [],
            },
            searchEcho: {
                display: true,
                query: '',
                selectedQueryFieldsDCILabels: null,
                selectedTopicFacetItems: [],
            },
            searchForm: {
                queryUI       : '',
                queryFieldsUI : QUERY_FIELDS,
            },
            spinner: {
                display: false,
            },
        };
    },
    methods : {
        addSelectedTopic( topic ) {
            this.currentSearch.selectedTopicFacetItems.push( topic );

            this.search(
                this.currentSearch.query,
                this.currentSearch.queryFields,
                this.currentSearch.selectedTopicFacetItems
            );
        },
        clearPreviewPane() {
            this.setPreviewPane( '', '' );
        },
        clearQueryOrChangeToWildcard() {
            // Change to blank search if no topic DCIs
            if ( this.currentSearch.selectedTopicFacetItems.length === 0 ) {
                this.currentSearch.query = '';
                this.searchForm.queryUI  = '';
            } else {
                // If topic DCIs and query is already "*", do nothing
                if ( this.currentSearch.query === '*' ) {
                    return;
                } else {
                    // If topic DCIs and query was not already "*", change to "*"
                    // and do a new search
                    this.currentSearch.query = '*';
                    this.searchForm.queryUI  = '*';
                }
            }

            this.search(
                this.currentSearch.query,
                this.currentSearch.queryFields,
                this.currentSearch.selectedTopicFacetItems
            );
        },
        clearTopicFilters() {
            this.facetPane.selectedTopicFacetItems = [];
        },
        displayPanes( ...panes ) {
            this.setPanesDisplay( panes, true );
        },
        hidePanes( ...panes ) {
            this.setPanesDisplay( panes, false );
        },
        previewFirstEpub() {
            this.setPreviewPane(
                this.resultsPane.results[ 0 ].groupValue,
                this.resultsPane.results[ 0 ].doclist.docs[ 0 ].title,
            );
        },
        newQuerySubmitted( query, queryFields ) {
            this.searchForm.queryUI = query;

            this.currentSearch.query = query;
            this.currentSearch.queryFields = queryFields;
            this.currentSearch.selectedTopicFacetItems = [];

            this.search( query, queryFields, [] );
        },
        removeSelectedTopic( topic ) {
            const found = this.currentSearch.selectedTopicFacetItems.findIndex(
                ( selectedTopicFacetItem ) => {
                    return selectedTopicFacetItem === topic;
                }
            );

            if ( found !== -1 ) {
                this.currentSearch.selectedTopicFacetItems.splice( found, 1 );
            }

            this.search(
                this.currentSearch.query,
                this.currentSearch.queryFields,
                this.currentSearch.selectedTopicFacetItems
            );
        },
        setFacetPaneFromSolrResponse( solrResponse ) {
            const topicFacetItems = solrResponse.facet_counts.facet_fields.topicNames_facet;

            if ( topicFacetItems ) {
                this.facetPane.topicsFacetList = [];
                for ( let i = 0; i < topicFacetItems.length; i = i + 2 ) {
                    const topic = topicFacetItems[ i ];
                    const numHits = topicFacetItems[ i + 1 ];
                    this.facetPane.topicsFacetList.push(
                        {
                            name: topic,
                            numHits: numHits.toLocaleString(),
                        }
                    );
                }
            }

            // Remove topics already selected by user
            this.currentSearch.selectedTopicFacetItems.forEach(
                ( selectedTopic ) => {
                    const found = this.facetPane.topicsFacetList.findIndex(
                        ( element ) => {
                            return element.name === selectedTopic;
                        }
                    );

                    if ( found !== -1 ) {
                        this.facetPane.topicsFacetList.splice( found, 1 );
                    }
                }
            );
        },
        setPanesDisplay( panes, state ) {
            panes.forEach( ( pane ) => {
                pane.display = state;
            } );
        },
        setPreviewPane( isbn, title ) {
            this.previewPane.isbn = isbn;
            this.previewPane.title = title;
        },
        setResultsPaneFromSolrResponse( solrResponse ) {
            this.resultsPane.numBooks = solrResponse.grouped.isbn.groups.length;
            this.resultsPane.numPages = solrResponse.grouped.isbn.matches;
            this.resultsPane.results  = solrResponse.grouped.isbn.groups;
        },
        setSearchEcho( query, queryFields, selectedTopicFacetItems ) {
            this.searchEcho.query = query;
            this.searchEcho.selectedQueryFieldsDCILabels = queryFields.map(
                function ( selectedQueryField ) {
                    return QUERY_FIELDS_BY_VALUE[ selectedQueryField ].dciLabel;
                }
            );
            this.searchEcho.selectedTopicFacetItems = selectedTopicFacetItems;
        },
        async search( query, queryFields, selectedTopicFacetItems ) {
            this.setSearchEcho( query, queryFields, selectedTopicFacetItems );

            this.hidePanes(
                this.facetPane,
                this.resultsPane,
                this.previewPane,
            );

            this.clearTopicFilters();
            this.clearPreviewPane();

            this.spinner.display = true;

            let response;
            try {
                response = await this.$solrSearch( query, queryFields, selectedTopicFacetItems );
            } catch( e ) {
                this.spinner.display = false;

                console.error( 'ERROR in App.solrSearch: ' + e );

                // TODO: replace this with something more user-friendly
                alert( 'Sorry, the server has returned an error or is not responding.' );

                return;
            }

            this.setFacetPaneFromSolrResponse( response );
            this.setResultsPaneFromSolrResponse( response );

            this.spinner.display = false;

            if ( this.resultsPane.results.length > 0 ) {
                this.displayPanes(
                    this.facetPane,
                    this.resultsPane,
                    this.previewPane,
                );
            } else {
                this.displayPanes( this.resultsPane );
            }

            return response;
        },
    },
};

</script>

<style>
    [v-cloak] { display: none; }
</style>
