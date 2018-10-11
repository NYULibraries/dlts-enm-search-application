<template>
    <div id="app">
        App
        <search-form/>
        <search-echo/>
        <facet-pane/>
        <results-pane/>
        <preview-pane/>
    </div>
</template>

<script>
import FacetPane from './components/FacetPane';
import PreviewPane from './components/PreviewPane';
import ResultsPane from './components/ResultsPane';
import SearchEcho from './components/SearchEcho';
import SearchForm from './components/SearchForm';
export default {
    name: 'App',
    components : { FacetPane, PreviewPane, ResultsPane, SearchEcho, SearchForm },
};
</script>

<style>
#app {
}
</style>
