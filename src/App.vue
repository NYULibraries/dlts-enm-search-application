<template>
    <div id="app">
        App
        <search-form/>
        <search-echo/>
        <facet-pane/>
        <results-pane/>
        <spinner/>
        <preview-pane/>
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
#app {
}
</style>
