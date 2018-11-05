<template>
    <section class="hero searchecho">
        <div class="container is-fluid">
            <div class="columns enm-searchecho">

                <div class="column">
                    <span
                        v-show="searchDCI && displaySearchDCI"
                        class="tag">
                        {{ searchDCI }}
                        <button
                            id="search-dci"
                            class="delete is-small"
                            @click="clickDeleteSearchDCI"></button>
                    </span>

                    <span
                        v-for="topicDCI in topicDCIs"
                        :key="topicDCI.id"
                        class="tag">
                        Topic:&nbsp;<span class="enm-topic">{{ topicDCI.topic }}</span>
                        <button
                            :id="topicDCI.id"
                            class="delete is-small"
                            @click="clickDeleteTopicDCI"></button>
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
