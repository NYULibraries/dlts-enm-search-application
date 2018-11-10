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
                    @click="loadFirstEpub">Load the first matched page</a>
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
                :bar-chart-data-matched-pages="[]"
                :display="!!isbn"
                :isbn="isbn"
                :title="title"
            />

            <div
                v-show="pageNumberForDisplay"
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
                v-show="pageNumberForDisplay"
                class="enm-pageText"
                v-html="pageText">
            </div>
        </div>
    </div>
</template>

<script>
import BarChart from './BarChart';
export default {
    name: 'PreviewPane',
    components: { BarChart },
    props: {
        display : {
            type     : Boolean,
            required : true,
            default  : false,
        },
        isbn: {
            type: String,
            required: true,
            default: null,
        },
        title: {
            type: String,
            required: true,
            default: null,
        },
    },
    data() {
        return {
            barChart: {
                isbn: this.isbn,
                title: this.title,
            },
            pageNumberForDisplay: null,
            pageText: null,
            topicsOnPage: null,
        };
    },
    methods: {
        loadFirstEpub() {

        },
    },
};
</script>

<style>
</style>
