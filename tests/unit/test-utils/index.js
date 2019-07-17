import { createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';

function createLocalVueWithVuex() {
    const localVue = createLocalVue();

    localVue.use( Vuex );

    return localVue;
}

function createReadonlyStore( query, queryFields, selectedTopicFieldFacetItems ) {
    const getters = {
        query                   : () => query,
        queryFields             : () => queryFields,
        selectedTopicFacetItems : () => selectedTopicFieldFacetItems,
    };

    return new Vuex.Store(
        {
            getters,
        }
    );
}

function queryFieldsUI() {
    // From App.vue QUERY_FIELDS_UI
    // Maybe need to DRY this up?
    return [
        {
            dciLabel : 'full texts',
            label    : 'Full Text',
            name     : 'fulltext',
            value    : 'pageText',
        },
        {
            dciLabel : 'topics',
            label    : 'Topics',
            name     : 'topics',
            value    : 'topicNames',
        },
    ];
}

export {
    createLocalVueWithVuex,
    createReadonlyStore,
    queryFieldsUI,
};
