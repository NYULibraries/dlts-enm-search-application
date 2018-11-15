<template>
    <div
        v-show="display"
        class="column enm-pane enm-pane-preview">

        <!--PREVIEW: NO EPUB SELECTED-->
        <div
            v-show="! isbn"
            id="message"
            class="message is-valign is-centered">
            <p class="message-body has-text-centered">Choose a book at left to view matched pages, or
                <br>
                <a
                    href="#"
                    @click="loadFirstMatchedPage">Load the first matched page</a>
            </p>
        </div>
        <!--PREVIEW: NO EPUB SELECTED-->

        <!--PREVIEW-->
        <div>
            <span
                v-if="isbn"
                id="preview-isbn"
                :name="isbn"
                style="display: none"></span>

            <bar-chart
                :bar-chart-data="barChart.barChartData"
                :display="!!isbn"
                :isbn="isbn"
                :title="title"
                @bar-click="previewEpubPage"
            />

            <div
                v-show="selectedPageNumber"
                class="enm-topicsonthispage">
                <h3>Topics on this page</h3>

                <ul>

                    <li
                        v-for="topicOnPage in topicsOnPage"
                        :key="topicOnPage">
                        <a
                            href="#"
                            v-html="topicOnPage">
                        </a>
                    </li>
                </ul>

                <div
                    v-if="topicsOnPage === null || topicsOnPage.length === 0"
                    class="enm-notopics">
                    No topics are associated with this page.
                </div>

            </div>

            <hr>

            <div
                v-show="selectedPageNumber"
                class="enm-pageText"
                v-html="pageText">
            </div>
        </div>
    </div>
</template>

<script>
import BarChart from './BarChart';

const ALTERNATE_NAMES_LIST_SEPARATOR = '&nbsp;&bull;&nbsp;';
const HIGHLIGHT_PRE = '<mark>';
const HIGHLIGHT_POST = '</mark>';

export default {
    name       : 'PreviewPane',
    components : { BarChart },
    props      : {
        currentSearch : {
            type     : Object,
            required : true,
            default  : null,
        },
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
            pageText           : null,
            selectedPageNumber : null,
            topicsOnPage       : null,
        };
    },
    watch: {
        isbn( newIsbn, oldIsbn ) {
            if ( newIsbn === '' ) {
                this.barChart.barChartData = [];
                this.pageText = null;
                this.selectedPageNumber = null;
                this.topicsOnPage = null;

                return;
            }

            this.previewEpub();
        },
    },
    methods: {
        loadFirstMatchedPage() {

        },
        async previewEpub() {
            let response;
            try {
                response = await this.solrPreviewEpub(
                    this.isbn,
                    this.currentSearch.query,
                    this.currentSearch.queryFields,
                    this.currentSearch.selectedTopicFacetFields,
                );
            } catch( e ) {
                console.error( 'ERROR in PreviewPane.previewEpub: ' + e );

                // TODO: replace this with something more user-friendly
                alert( 'Sorry, the server has returned an error or is not responding.' );

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

            // Draw bar chart
            // Trigger click of bar for first matched page
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
