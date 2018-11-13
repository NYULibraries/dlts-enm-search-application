<template>
    <div id="app">
        <search-form
            :query-fields="searchForm.queryFields"
            @submit="newQuerySubmitted"/>
        <div v-cloak>
            <search-echo
                :display="searchEcho.display"
                :query="searchEcho.query"
                :selected-query-fields-d-c-i-labels="searchEcho.selectedQueryFieldsDCILabels"
                :selected-topic-facet-items="searchEcho.selectedTopicFacetItems"
            />
            <div class="container is-fluid">
                <div class="columns enm-panes">
                    <facet-pane
                        :display="facetPane.display"
                        :topics-facet-list="facetPane.topicsFacetList"
                        :topics-facet-list-limit="facetPane.topicsFacetListLimit"
                        @topic-click="newLimitByTopicList"
                    />

                    <spinner :display="spinner.display"/>

                    <results-pane
                        :display="resultsPane.display"
                        :num-books="resultsPane.numBooks"
                        :num-pages="resultsPane.numPages"
                        :results="resultsPane.results"
                    />
                    <preview-pane
                        :display="previewPane.display"
                        :isbn="previewPane.isbn"
                        :title="previewPane.title"
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
                display: false,
                query: '',
                selectedQueryFieldsDCILabels: null,
                selectedTopicFacetItems: [],
            },
            searchForm: {
                queryFields: QUERY_FIELDS,
            },
            spinner: {
                display: false,
            },
        };
    },
    methods : {
        clearPreviewPane() {
            this.setPreviewPane( '', '' );
        },
        clearTopicFilters() {
            this.facetPane.selectedTopicFacetItems = [];
        },
        displayPanes( ...panes ) {
            this.setPanesDisplay( panes, true );
        },
        setPanesDisplay( panes, state ) {
            panes.forEach( ( pane ) => {
                pane.display = state;
            } );
        },
        hideAllPanes() {
            this.setPanesDisplay(
                [
                    this.searchEcho,
                    this.facetPane,
                    this.resultsPane,
                    this.previewPane,
                ],
                false
            );
        },
        loadFirstResultInPreviewPane() {
            if ( this.resultsPane.results.length > 0 ) {
                const firstResult = this.resultsPane.results[ 0 ];
                this.previewPane.isbn  = firstResult.groupValue;
                this.previewPane.title = firstResult.doclist.docs[ 0 ].title;
            } else {
                this.previewPane.isbn = '';
            }
        },
        newLimitByTopicList( selectedTopicFacetItems ) {
            this.$currentSearch.selectedTopicFacetItems = selectedTopicFacetItems;

            this.solrSearch(
                this.$currentSearch.query,
                this.$currentSearch.queryFields,
                selectedTopicFacetItems
            );
        },
        newQuerySubmitted( query, queryFields ) {
            this.$currentSearch.query = query;
            this.$currentSearch.queryFields = queryFields;
            this.$currentSearch.selectedTopicFacetItems = [];

            this.solrSearch( query, queryFields, [] );
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
            this.facetPane.selectedTopicFacetItems.forEach(
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
        async solrPreviewEpub() {
            const response = await this.$solrPreviewEpub(
                '9780472024490',
                'art',
                [ 'pageText', 'topicNames' ],
                [ 'postmodernism', 'Hutcheon, Linda' ],
            );

            return response;
        },
        async solrPreviewPage() {
            const response = await this.$solrPreviewPage(
                '9780472024490',
                88,
                'art',
                [ 'pageText', 'topicNames' ],
            );

            return response;
        },
        async solrSearch( query, queryFields, selectedTopicFacetItems ) {
            this.hideAllPanes();

            this.clearTopicFilters();
            this.clearPreviewPane();

            this.setSearchEcho( query, queryFields, selectedTopicFacetItems );
            this.displayPanes( this.searchEcho );

            this.spinner.display = true;

            const response = await this.$solrSearch( query, queryFields, selectedTopicFacetItems );

            this.setFacetPaneFromSolrResponse( response );
            this.setResultsPaneFromSolrResponse( response );

            this.spinner.display = false;

            this.displayPanes(
                this.facetPane,
                this.resultsPane,
                this.previewPane,
            );

            return response;
        },
    },
};

</script>

<style>
    [v-cloak] { display: none; }
</style>
