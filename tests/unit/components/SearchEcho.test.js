import SearchEcho from '@/components/SearchEcho';

import { createLocalVue, shallowMount } from '@vue/test-utils';
import merge from 'lodash.merge';
import Vuex from 'vuex';
import { createLocalVueWithVuex } from '../test-utils';

// From App.vue
// Maybe need to DRY this up?
const QUERY_FIELDS_UI = [
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

function createWrapper( overrides ) {
    const defaultMountingOptions = {
        propsData : {
            display       : false,
            queryFieldsUI : QUERY_FIELDS_UI,
        },
    };

    return shallowMount( SearchEcho, merge( defaultMountingOptions, overrides ) );
}

describe( 'SearchEcho', () => {
    const SEARCH_DCI_DISMISSED_EVENT = 'search-dci-dismiss';

    test( 'does not display any DCIs when query is empty', () => {
    } );

    test( 'does not display topic DCIs when selectedTopicItems is empty', () => {
    } );

    test( 'displays correct DCIs when query submitted against full-text only', () => {
    } );

    test( 'displays correct DCIs when query submitted against topics only', () => {
    } );

    test( 'displays correct DCIs when query submitted against full-text and topics', () => {
    } );

    test( 'displays correct DCIs when facet items are selected', () => {
    } );

    test( 'dismissing search DCI calls setQuery with correct arguments', () => {
    } );

    test( `dismissing search DCI emits "${ SEARCH_DCI_DISMISSED_EVENT }"`, () => {
    } );

    test( 'dismissing topic DCI calls removeSelectedTopicFacetItem with correct arguments', () => {
    } );
} );
