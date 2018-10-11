<template>
    <div id="preview-pane">
        PreviewPane
        <bar-chart/>
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
    #preview-pane {
    }
</style>
