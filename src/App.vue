<template>
    <div id="app">
        <search-form/>
        <div v-cloak>
            <search-echo/>
            <div class="container is-fluid">
                <div class="columns enm-panes">
                    <div class="column enm-pane enm-pane-facets is-2">
                        <facet-pane/>
                    </div>
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
};

</script>

<style>
    [v-cloak] { display: none; }
</style>
