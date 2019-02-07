<template>
    <div
        v-show="display"
        class="column enm-pane enm-pane-preview"
    >
        <!--PREVIEW: NO EPUB SELECTED-->
        <div
            v-show="! isbn"
            id="message"
            class="message is-valign is-centered"
        >
            <p class="message-body has-text-centered">
                Choose a book at left to view matched pages, or
                                                             <br>
                                                             <a
                                                                 href="#"
                                                                 @click="loadFirstMatchedPage"
                                                             >
                                                                 Load the first matched page
                                                             </a>
            </p>
        </div>
        <!--PREVIEW: NO EPUB SELECTED-->

        <!--PREVIEW-->
        <div>
            <span
                v-if="isbn"
                id="preview-isbn"
                :name="isbn"
                style="display: none"
            ></span>

            <BarChart
                v-show="! errorPreviewEpub"
                :bar-chart-data="barChart.barChartData"
                :title="title"
                @bar-click="previewEpubPage"
            />

            <h2
                v-show="errorPreviewEpub"
                class="is-size-4"
            >
                Sorry, due to a server error this EPUB cannot be previewed.
                Please try your search again later.
            </h2>

            <div
                v-show="selectedPageNumber && ! errorPreviewEpub && ! errorPreviewPage"
                class="enm-topicsonthispage"
            >
                <h3>Topics on this page</h3>

                <ul>
                    <li
                        v-for="topicOnPage in topicsOnPage"
                        :key="topicOnPage"
                    >
                        <!-- eslint-disable vue/no-v-html -->
                        <a
                            href="#"
                            v-html="topicOnPage"
                        >
                        <!-- eslint-disable -->
                        </a>
                    </li>
                </ul>

                <div
                    v-if="topicsOnPage === null || topicsOnPage.length === 0"
                    class="enm-notopics"
                >
                    No topics are associated with this page.
                </div>
            </div>

            <hr>

            <h2
                v-show="selectedPageNumber && errorPreviewPage"
                class="is-size-4"
            >
                Sorry, due to a server error this page cannot be previewed.
                Please try your search again later.
            </h2>

            <!-- eslint-disable vue/no-v-html -->
            <div
                v-show="selectedPageNumber && ! errorPreviewEpub && ! errorPreviewPage"
                class="enm-pageText"
                v-html="pageText"
            >
            <!-- eslint-enable -->
            </div>
        </div>
    </div>
</template>

<script>
import BarChart from './BarChart';

import { mapGetters } from 'vuex';

const ALTERNATE_NAMES_LIST_SEPARATOR = '&nbsp;&bull;&nbsp;';
const HIGHLIGHT_PRE = '<mark>';
const HIGHLIGHT_POST = '</mark>';

export default {
    name       : 'PreviewPane',
    components : { BarChart },
    props      : {
        display       : {
            type     : Boolean,
            required : true,
            default  : false,
        },
        isbn          : {
            type     : String,
            required : true,
            default  : null,
        },
        title         : {
            type     : String,
            required : true,
            default  : null,
        },
    },
    data() {
        return {
            barChart           : {
                barChartData : [],
                isbn         : this.isbn,
                title        : this.title,
            },
            errorPreviewEpub   : false,
            errorPreviewPage   : false,
            pageText           : null,
            selectedPageNumber : null,
            topicsOnPage       : null,
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
        isbn( newIsbn, oldIsbn ) {
            if ( newIsbn === '' ) {
                this.errorPreviewEpub = false;
                this.errorPreviewPage = false;

                this.barChart.barChartData = [];
                this.pageText = null;
                this.selectedPageNumber = null;
                this.topicsOnPage = null;

                return;
            }

            this.previewEpub();
        },
    },
    methods : {
        loadFirstMatchedPage() {
            this.$emit( 'load-first-matched-page-link-click' );
        },
        async previewEpub() {
            let response;
            try {
                response = await this.solrPreviewEpub(
                    this.isbn,
                    this.query,
                    this.queryFields,
                    this.selectedTopicFacetItems,
                );
            } catch( e ) {
                this.errorPreviewEpub = true;

                return;
            }

            const barChartData = [];

            // docs are sorted by pageSequenceNumber in asc order
            response.response.docs.forEach( ( doc ) => {
                barChartData.push(
                    {
                        page  : doc.pageNumberForDisplay,
                        score : doc.score,
                    }
                );
            } );

            this.barChart.barChartData = barChartData;
        },
        async previewEpubPage( pageNumberForDisplay ) {
            this.selectedPageNumber = pageNumberForDisplay;

            let response;
            try {
                response = await this.solrPreviewPage(
                    this.isbn,
                    this.selectedPageNumber,
                    this.query,
                    this.queryFields
                );
            } catch( e ) {
                this.errorPreviewPage = true;

                return;
            }

            const doc = response.response.docs[ 0 ];
            const highlights = response.highlighting[
                Object.keys( response.highlighting )[ 0 ]
            ];

            let topicHighlights, topicsOnPage = [];
            let topicNamesLists;

            if ( highlights.pageText ) {
                this.pageText = highlights.pageText[ 0 ];
            } else {
                this.pageText = doc.pageText;
            }

            if ( highlights.topicNamesForDisplay ) {
                // Sample of prettified JSON string (without wrapping quotes):
                // [
                //     [
                //         "Conference on Critical Legal Studies"
                //     ],
                //     [
                //         "<mark>identity</mark> -- politics of",
                //         "<mark>Identity</mark> politics",
                //         "\"<mark>Identity</mark> politics\"",
                //         "Politics of <mark>identity</mark>"
                //     ],
                //     [
                //         "Ideology of the subject"
                //     ]
                // ]

                topicHighlights = JSON.parse( highlights.topicNamesForDisplay );
                topicHighlights.forEach( ( topicHighlightArray ) => {
                    const preferredName = topicHighlightArray.shift();
                    const alternateNames = topicHighlightArray;

                    if ( alternateNames.length === 0 ) {
                        // No alternate names
                        topicsOnPage.push( preferredName );
                    } else {
                        if ( namesListContainsHighlights( alternateNames ) ) {
                            // Display alternate names - they contain highlights
                            topicsOnPage.push(
                                preferredName +
                                ' <span class="enm-alt-names">(also: ' +
                                alternateNames.join( ALTERNATE_NAMES_LIST_SEPARATOR ) +
                                ')</span>'
                            );
                        } else {
                            // Do not display alternate names - they do not contain highlights
                            topicsOnPage.push( preferredName );
                        }
                    }
                } );

                this.topicsOnPage = topicsOnPage;
            } else if ( doc.topicNamesForDisplay ) {
                topicNamesLists = JSON.parse( doc.topicNamesForDisplay );
                this.topicsOnPage = topicNamesLists.map(
                    ( topicNamesList ) => {
                        // The display/preferred name is the first element
                        return topicNamesList.shift();
                    }
                );
            } else {
                this.topicsOnPage = [];
            }
        },
        async solrPreviewEpub( isbn, query, queryFields, selectedTopicFacetFields ) {
            const response = await this.$solrPreviewEpub(
                isbn,
                query,
                queryFields,
                selectedTopicFacetFields,
            );

            return response;
        },
        async solrPreviewPage( isbn, pageNumberForDisplay, query, queryFields ) {
            const response = await this.$solrPreviewPage(
                isbn,
                pageNumberForDisplay,
                query,
                queryFields
            );

            return response;
        },
    },
};

function namesListContainsHighlights( alternateNames ) {
    return alternateNames.filter( ( alternateName ) => {
        return alternateName.indexOf( HIGHLIGHT_PRE ) !== -1 &&
               alternateName.indexOf( HIGHLIGHT_POST ) !== -1;
    } ).length > 0;
}
</script>

<style>
</style>
