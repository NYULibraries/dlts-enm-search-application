<template>
    <div :class="previewPane.isbn ? resultsPane.classes.previewPaneLoaded : resultsPane.classes.previewPaneNotLoaded">

        <spinner/>

        <!--RESULTS-->
        <template v-show="displayResultsPane">
            <!-- v-show is necessary on this <header> element for some reason.
                 Its visibility is not being toggled along with the other elements
                 in this <template>.
            -->
            <header v-show="displayResultsPane">
                <h2 class="is-size-4">Results: {{ resultsHeader }}</h2>
            </header>
            <div class="enm-results" v-show="displayResultsPane">

            <span v-if="! results || results.length === 0">
              Please try another search.
            </span>

                <!--BOOK-->
                <div
                     :id="result.groupValue"
                     :name="result.doclist.docs[ 0 ].title"
                     class="box" v-for="result in results"
                     @click="previewEpub">
                    <article class="media enm-book">
                        <div class="media-left">
                            <figure class="image enm-thumbnail">
                                <img :src="'assets/covers/' + result.groupValue + '.jpg'" alt="">
                            </figure>
                        </div>
                        <div class="media-content">
                            <!-- da70 Here, the link to load the preview is repeated.  THe first one is for fancy "whole div" rollovrers and the second is for accessibility.  Not sure how this will work with vue.js  -->
                            <a class="enm-divlink" href="#">&nbsp;</a>
                            <h3 class="title is-spaced"><a href="#">{{ result.doclist.docs[ 0 ].title }}</a></h3>
                            <div class="meta">
                                {{ result.doclist.docs[ 0 ].authors.join( '; ' )  +
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
    name: 'ResultsPane',
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
