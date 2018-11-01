<template>
    <div
        v-show="displayPreviewPane"
        class="column enm-pane enm-pane-preview">

        <!--PREVIEW: NO EPUB SELECTED-->
        <div
            v-show="! previewPane.isbn"
            id="message"
            class="message is-valign is-centered">
            <p class="message-body has-text-centered">Choose a book at left to view matched pages, or
                <br>
                <a
                    href="#"
                    @click="loadFirstEpub">Load the first matched page</a>
            </p>
        </div>
        <!--PREVIEW: NO EPUB SELECTED-->

        <!--PREVIEW-->
        <div>
            <span
                v-if="previewPane.isbn"
                id="preview-isbn"
                :name="previewPane.isbn"
                style="display: none"></span>

            <bar-chart/>

            <div
                v-show="previewPane.pageNumberForDisplay"
                class="enm-topicsonthispage">
                <h3>Topics on this page</h3>

                <ul>

                    <li
                        v-for="topicOnPage in previewPane.topicsOnPage"
                        :key="topicOnPage">
                        <a
                            href="#"
                            v-html="topicOnPage">
                        </a>
                    </li>
                </ul>

                <div
                    v-if="previewPane.topicsOnPage === null || previewPane.topicsOnPage.length === 0"
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
