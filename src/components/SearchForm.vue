<template>
    <section class="hero is-primary enm-searchbox-hero">
      <div class="hero-body">
      <div class="container is-fluid">
        <form v-on:submit.prevent="submitSearchForm" class="enm-searchform">
          <div class="enm-searchbox">
            <div class="field columns level">
              <div class="column level-item">
                <p class="control has-icons-left">
                   <label class="enm-visually-hidden" for="enm-searchinput">Search inside all books</label>
                  <input id="enm-searchinput"
                         v-model="query"
                         class="input is-large"
                         type="text"
                         placeholder="Search inside all books">
                  <span class="icon is-small is-left"><i class="fa fa-search"></i></span>
                </p>
              </div>

              <div class="column is-narrow">

                <template v-for="queryField in queryFields">
                  <input
                         v-bind:name="queryField.name + 'Chx'"
                         v-bind:id="queryField.name + 'Chx'"
                         v-bind:value="queryField.value"
                         v-model="selectedQueryFields"
                         v-on:click="clickFieldCheckbox( $event.checked )"
                         type="checkbox" class="is-medium is-checkbox">
                  <label v-bind:for="queryField.name + 'Chx'" class="">
                    {{ queryField.label }}
                  </label>
                </template>

              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
    </section>
</template>

<script>
export default {
    name: 'SearchForm',
};
</script>

<style>
</style>
