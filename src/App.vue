<template>
    <div id="app">
        <SearchForm
            :query-fields-u-i="searchForm.queryFieldsUI"
            @submit="submitSearchForm"
        />
        <div v-cloak>
            <SearchEcho
                :display="searchEcho.display"
                :query-fields-u-i="searchForm.queryFieldsUI"
                @search-dci-dismiss="clickDismissSearchDCI"
            />
            <div class="container is-fluid">
                <div class="columns enm-panes">
                    <FacetPane
                        :display="facetPane.display"
                        :topics-facet-list="facetPane.topicsFacetList"
                        :topics-facet-list-limit="facetPane.topicsFacetListLimit"
                    />

                    <Spinner :display="spinner.display" />

                    <ResultsPane
                        :display="resultsPane.display"
                        :error="resultsPane.error"
                        :num-books="resultsPane.numBooks"
                        :num-pages="resultsPane.numPages"
                        :results="resultsPane.results"
                        @epub-click="setPreviewPane"
                    />
                    <PreviewPane
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

import { mapGetters, mapActions } from 'vuex';

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

export default {
    name       : 'App',
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
            disableWatch : {
                selectedTopicFacetItems : false,
            },

            facetPane : {
                display              : false,
                topicsFacetList      : [],
                topicsFacetListLimit : 15,
            },
            previewPane : {
                display : false,
                isbn    : '',
                title   : '',
            },
            resultsPane : {
                display  : false,
                error    : false,
                numBooks : 0,
                numPages : 0,
                results  : [],
            },
            searchEcho : {
                display       : true,
                queryFieldsUI : QUERY_FIELDS,
            },
            searchForm : {
                queryUI       : '',
                queryFieldsUI : QUERY_FIELDS,
            },
            spinner : {
                display : false,
            },
        };
    },
    computed : {
        ...mapGetters(
            [
                'query',
                'queryFields',
                'selectedTopicFacetItems',
            ]
        ),
    },
    watch : {
        selectedTopicFacetItems() {
            if ( this.disableWatch.selectedTopicFacetItems ) {
                // We allow only one-time disabling of this watch
                this.disableWatch.selectedTopicFacetItems = false;

                return;
            }

            this.search();
        },
    },
    methods : {
        ...mapActions(
            [
                'clearSelectedTopicFacetItems',
                'setQuery',
                'setQueryFields',
                'setSelectedTopicFacetItems',
            ]
        ),
        clearPreviewPane() {
            this.setPreviewPane( '', '' );
        },
        clearResultsPane() {
            this.resultsPane.error    = false;
            this.resultsPane.numBooks = 0;
            this.resultsPane.numPages = 0;
            this.resultsPane.results  = [];
        },
        clickDismissSearchDCI() {
            this.search();
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
        setFacetPaneFromSolrResponse( solrResponse ) {
            const topicFacetItems = solrResponse.facet_counts.facet_fields.topicNames_facet;

            if ( topicFacetItems ) {
                this.facetPane.topicsFacetList = [];
                for ( let i = 0; i < topicFacetItems.length; i = i + 2 ) {
                    const topic = topicFacetItems[ i ];
                    const numHits = topicFacetItems[ i + 1 ];
                    this.facetPane.topicsFacetList.push(
                        {
                            name    : topic,
                            numHits : numHits.toLocaleString(),
                        }
                    );
                }
            }

            // Remove topics already selected by user
            this.selectedTopicFacetItems.forEach(
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
        submitSearchForm() {
            // If we don't disable selectedTopicFacetItems watch, clearSelectedTopicFacetItems
            // will trigger another search.
            this.disableWatch.selectedTopicFacetItems = true;
            this.clearSelectedTopicFacetItems();
            this.search();
        },
        async search() {
            this.hidePanes(
                this.facetPane,
                this.resultsPane,
                this.previewPane,
            );

            this.clearPreviewPane();
            this.clearResultsPane();

            this.spinner.display = true;

            let response;
            try {
                response = await this.$solrSearch(
                    this.query,
                    this.queryFields,
                    this.selectedTopicFacetItems
                );
            } catch( e ) {
                this.spinner.display = false;

                this.resultsPane.error = true;

                this.displayPanes( this.resultsPane );

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
