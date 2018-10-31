<template>
    <div class="column enm-pane enm-pane-preview" v-show="displayPreviewPane">

        <!--PREVIEW: NO EPUB SELECTED-->
        <div v-show="! previewPane.isbn"id="message" class="message is-valign is-centered">
            <p class="message-body has-text-centered">Choose a book at left to view matched pages, or
                <br>
                <a @click="loadFirstEpub" href="#">Load the first matched page</a>
            </p>
        </div>
        <!--PREVIEW: NO EPUB SELECTED-->

        <!--PREVIEW-->
        <div>
            <span v-if="previewPane.isbn" id="preview-isbn" :name="previewPane.isbn" style="display: none"></span>

            <header @click="barChartShowAllPages = ! barChartShowAllPages">
                <div v-show="previewPane.pageNumberForDisplay" class="enm-pageno">page {{ previewPane.pageNumberForDisplay }}</div>
                <h2 v-show="previewPane.title" class="title is-spaced">{{ previewPane.title }}</h2>
            </header>

            <svg width="572" height="190"></svg>

            <div v-show="previewPane.isbn" class="enm-buttons">
                <a
                    @click="clickPrevious"
                    :disabled="previewPane.pageIndex === 0"
                    href="#" class="button" title="View previous matched page in this book">
                    &lt; previous </a>
                <a
                    :disabled="previewPane.pageIndex === barChartDataMatchedPages.length - 1"
                    href="#" class="button" title="View next matched page in this book"
                    @click="clickNext"
                >
                    next &gt;</a>
            </div>

            <div v-show="previewPane.pageNumberForDisplay" class="enm-topicsonthispage">
                <h3>Topics on this page</h3>

                <ul>

                    <li v-for="topicOnPage in previewPane.topicsOnPage"
                        :key="topicOnPage">
                        <a href="#"
                           v-html="topicOnPage">
                        </a>
                    </li>
                </ul>

                <div v-if="previewPane.topicsOnPage === null || previewPane.topicsOnPage.length === 0"
                     class="enm-notopics">
                    No topics are associated with this page.
                </div>

            </div>

            <hr>

            <div
                v-show="previewPane.pageNumberForDisplay"
                class="enm-pageText"
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
