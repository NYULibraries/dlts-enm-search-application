<template>
    <div class="column enm-pane enm-pane-preview" v-show="displayPreviewPane">

        <!--PREVIEW: NO EPUB SELECTED-->
        <div id="message" class="message is-valign is-centered" v-show="! previewPane.isbn">
            <p class="message-body has-text-centered">Choose a book at left to view matched pages, or
                <br>
                <a href="#" v-on:click="loadFirstEpub">Load the first matched page</a>
            </p>
        </div>
        <!--PREVIEW: NO EPUB SELECTED-->

        <!--PREVIEW-->
        <div>
            <span id="preview-isbn" :name="previewPane.isbn" style="display: none" v-if="previewPane.isbn"></span>

            <header v-on:click="barChartShowAllPages = ! barChartShowAllPages">
                <div class="enm-pageno" v-show="previewPane.pageNumberForDisplay">page {{ previewPane.pageNumberForDisplay }}</div>
                <h2 class="title is-spaced" v-show="previewPane.title">{{ previewPane.title }}</h2>
            </header>

            <svg width="572" height="190"></svg>

            <div class="enm-buttons" v-show="previewPane.isbn">
                <a href="#" class="button" title="View previous matched page in this book"
                   v-on:click="clickPrevious"
                   v-bind:disabled="this.previewPane.pageIndex === 0">
                    < previous </a>
                <a href="#" class="button" title="View next matched page in this book"
                   v-on:click="clickNext"
                   v-bind:disabled="this.previewPane.pageIndex === this.barChartDataMatchedPages.length - 1">
                    next ></a>
            </div>

            <div class="enm-topicsonthispage" v-show="previewPane.pageNumberForDisplay">
                <h3>Topics on this page</h3>

                <ul>
                    <li v-for="topicOnPage in previewPane.topicsOnPage">
                        <a href="#"
                           v-html="topicOnPage">
                        </a>
                    </li>
                </ul>

                <div class="enm-notopics"
                     v-if="previewPane.topicsOnPage === null || previewPane.topicsOnPage.length === 0">
                    No topics are associated with this page.
                </div>

            </div>

            <hr>

            <div class="enm-pageText"
                 v-show="previewPane.pageNumberForDisplay"
                 v-html="previewPane.pageText">
            </div>
        </div>
    </div>
</template>

<script>
import BarChart from './BarChart';
export default {
    name: 'PreviewPane',
    components: { BarChart },
};
</script>

<style>
</style>
