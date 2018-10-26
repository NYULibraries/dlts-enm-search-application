<template>
    <section class="hero searchecho">
      <div class="container is-fluid">
      <div class="columns enm-searchecho">

        <div class="column">
        <span class="tag"
              v-show="searchDCI && displaySearchDCI">
          {{ searchDCI }}
          <button class="delete is-small"
                  id="search-dci"
                  v-on:click="clickDeleteSearchDCI"></button>
        </span>

        <span class="tag"
                v-for="topicDCI in topicDCIs">
          Topic:&nbsp;<span class="enm-topic">{{ topicDCI.topic }}</span>
          <button class="delete is-small"
                  v-bind:id="topicDCI.id"
                  v-on:click="clickDeleteTopicDCI"></button>
        </span>
        </div>
      </div>
      </div>
    </section>
</template>

<script>
export default {
    name: 'SearchEcho',
};
</script>

<style>
</style>
