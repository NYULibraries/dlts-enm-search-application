<template>
    <div id="bar-chart">
        <header>
            <div
                v-show="pageNumberForDisplay"
                class="enm-pageno">page {{ pageNumberForDisplay }}</div>
            <h2
                v-show="title"
                class="title is-spaced">{{ title }}</h2>
        </header>

        <svg
            width="572"
            height="190"/>

        <div
            v-show="isbn"
            class="enm-buttons">
            <a
                :disabled="pageIndex === 0"
                href="#"
                class="button"
                title="View previous matched page in this book"
                @click="clickPrevious"
            >
                &lt; previous </a>
            <a
                :disabled="pageIndex === barChartDataMatchedPages.length - 1"
                href="#"
                class="button"
                title="View next matched page in this book"
                @click="clickNext"
            >
                next &gt;</a>
        </div>
    </div>
</template>

<script>
export default {
    name: 'BarChart',
    props: {
        isbn: {
            type: String,
            required: true,
            default: null,
        },
        barChartDataMatchedPages: {
            type: Array,
            required: true,
            default: function () {
                return null;
            },
        },
        title: {
            type: String,
            required: true,
            default: null,
        },
    },
    data() {
        return {
            pageNumberForDisplay: null,
            pageIndex: null,
        };
    },
    methods: {
        clickNext() {

        },
        clickPrevious() {

        },
    },
};
</script>

<style>
    .bar:hover {
        fill: grey;
    }

    .tooltip-score {
        font-size: 16px;
        margin-top: 15px;
    }

    /* Based on https://raw.githubusercontent.com/Caged/d3-tip/2de7071bb27fdd0a78b5208cb7d59f2988aaf10b/examples/example-styles.css */

    .d3-tip {
        line-height: 1;
        font-weight: bold;
        padding: 12px;
        background: #585858;
        color: white;
        border-radius: 2px;
        pointer-events: none;
    }

    /* Creates a small triangle extender for the tooltip */
    .d3-tip:after {
        box-sizing: border-box;
        display: inline;
        font-size: 10px;
        width: 100%;
        line-height: 1;
        color: rgba(0, 0, 0, 0.8);
        position: absolute;
        pointer-events: none;
    }

    /* Northward tooltips */
    .d3-tip.n:after {
        content: "\25BC";
        margin: -1px 0 0 0;
        top: 100%;
        left: 0;
        text-align: center;
    }

    /* Eastward tooltips */
    .d3-tip.e:after {
        content: "\25C0";
        margin: -4px 0 0 0;
        top: 50%;
        left: -8px;
    }

    /* Southward tooltips */
    .d3-tip.s:after {
        content: "\25B2";
        margin: 0 0 1px 0;
        top: -8px;
        left: 0;
        text-align: center;
    }

    /* Westward tooltips */
    .d3-tip.w:after {
        content: "\25B6";
        margin: -4px 0 0 -1px;
        top: 50%;
        left: 100%;
    }
</style>
