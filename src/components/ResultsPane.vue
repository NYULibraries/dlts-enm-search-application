<template>
    <div :class="isbnOfSelectedEpub ? previewPaneLoadedClass : previewPaneNotLoadedClass">

        <!--RESULTS-->
        <template v-show="display">
            <!-- v-show is necessary on this <header> element for some reason.
                 Its visibility is not being toggled along with the other elements
                 in this <template>.
            -->
            <header v-show="display">
                <h2 class="is-size-4">Results: {{ resultsHeader }}</h2>
            </header>
            <div
                v-show="display"
                class="enm-results">

                <span v-if="! results || results.length === 0">
                    Please try another search.
                </span>

                <!--BOOK-->
                <div
                    v-for="result in results"
                    :id="result.groupValue"
                    :name="result.doclist.docs[ 0 ].title"
                    :key="result.groupValue"
                    class="box"
                    @click="previewEpub">
                    <article class="media enm-book">
                        <div class="media-left">
                            <figure class="image enm-thumbnail">
                                <img
                                    :src="'/enm/search/assets/covers/' + result.groupValue + '.jpg'"
                                    alt="">
                            </figure>
                        </div>
                        <div class="media-content">
                            <!-- The link to load the preview is repeated.
                                 Tte first one is for fancy "whole div" rollovers
                                 and the second is for accessibility.
                                 TODO: Check with Laura to see if the above still holds. -->
                            <a
                                class="enm-divlink"
                                href="#">&nbsp;</a>
                            <h3 class="title is-spaced"><a href="#">{{ result.doclist.docs[ 0 ].title }}</a></h3>
                            <div class="meta">
                                {{ result.doclist.docs[ 0 ].authors.join( '; ' ) +
                                    '; ' +
                                result.doclist.docs[ 0 ].publisher }}
                            </div>
                            <div class="matches">
                                {{ result.doclist.numFound.toLocaleString() }} matched pages
                            </div>
                            <div class="relevance">
                                Maximum page relevance score: <span>{{ result.doclist.maxScore }}</span>
                            </div>
                        </div>
                    </article>
                </div>
                <!--BOOK-->

            </div>
        </template>
        <!--RESULTS-->

    </div>
</template>

<script>
export default {
    name  : 'ResultsPane',
    props : {
        display  : {
            type     : Boolean,
            required : true,
            default  : false,
        },
        numBooks : {
            type     : Number,
            required : true,
            default  : null,
        },
        numPages : {
            type     : Number,
            required : true,
            default  : null,
        },
        results  : {
            type     : Array,
            required : true,
            default  : function () {
                return null;
            },
        },
    },
    data() {
        return {
            isbnOfSelectedEpub        : null,
            previewPaneLoadedClass    : 'column enm-pane enm-pane-results is-4',
            previewPaneNotLoadedClass : 'column enm-pane enm-pane-results is-half',
        };
    },
    computed : {
        numBooksFormatted : function () {
            return this.numBooks ? this.numBooks.toLocaleString() : '';
        },
        numPagesFormatted : function () {
            return this.numPages ? this.numPages.toLocaleString() : '';
        },
        resultsHeader : function () {
            if ( this.results && this.results.length > 0 ) {
                return this.numPagesFormatted + ' pages in ' + this.numBooksFormatted + ' books';
            } else {
                return 'None';
            }
        },
    },
    methods : {
        previewEpub( event ) {
            const isbn = event.currentTarget.id;
            const title = event.currentTarget.getAttribute( 'name' );

            this.isbnOfSelectedEpub = isbn;

            this.$emit( 'epub-click', isbn, title );
        },
    },
};
</script>

<style>
    .book-cover-thumbnail {
        max-height: 64px;
        width: auto !important;
    }

    .enm-page-active {
        fill: lightgrey;
        stroke: black;
    }
</style>
