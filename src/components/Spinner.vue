<template>
    <!--
          From: http://cssload.net/en/spinners
          Author: https://codepen.io/Terramaster/
    -->
    <div v-show="displaySpinner" id="spinner">
        <div class="overlay-loader">
            <div class="loader">
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'Spinner',
};
</script>

<style>
    #spinner {
    }
</style>
