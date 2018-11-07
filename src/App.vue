<template>
    <div id="app">
        <button
            id="debug"
            @click="debugSearch">DEBUG</button>
        <div>{{ debug }}</div>
        <search-form/>
        <div v-cloak>
            <search-echo/>
            <div class="container is-fluid">
                <div class="columns enm-panes">
                    <facet-pane/>
                    <results-pane/>
                    <preview-pane/>
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
export default {
    name: 'App',
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
            debug : null,
        };
    },
    methods : {
        async debugSearch() {
            this.debug = await this.search();
        },
        async search() {
            const response = await this.$search(
                {
                    q: 'art',
                    'facet.field': 'topicNames_facet',
                    'facet.limit': '-1',
                    'facet.mincount': '1',
                    'facet.sort': 'count',
                    facet: 'on',
                    fl: 'title,authors,publisher,yearOfPublication,score',
                    'group.field': 'isbn',
                    group: 'true',
                    'group.limit': '999',
                    qf: 'pageText%20topicNames',
                    rows: '1999',
                    sort: 'score%20desc,title_facet%20asc',
                }
            );

            return response;
        },
    },
};

</script>

<style>
    [v-cloak] { display: none; }
</style>
