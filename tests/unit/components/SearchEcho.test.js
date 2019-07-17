import SearchEcho from '@/components/SearchEcho';

import { shallowMount } from '@vue/test-utils';
import merge from 'lodash.merge';
import Vuex from 'vuex';
import { createLocalVueWithVuex } from '../test-utils';

const QUERY_FIELDS_FULL_TEXT     = 'pageText';
const QUERY_FIELDS_TOPIC_NAMES   = 'topicNames';
const QUERY_FIELDS_ALL           = Object.freeze( [ QUERY_FIELDS_FULL_TEXT, QUERY_FIELDS_TOPIC_NAMES ] );
const SEARCH_DCI_ID              = 'search-dci';
const SEARCH_DCI_SELECTOR        = `button[ id = "${ SEARCH_DCI_ID }" ]`;
const SELECTED_TOPIC_FACET_ITEMS = Object.freeze( [ 'topic 0', 'topic 1', 'topic 2', 'topic 3' ] );

function createWrapper( storeOverrides, mountingOverrides ) {
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
    const localVue = createLocalVueWithVuex();
    const defaultStoreOptions = {
        actions : {
            removeSelectedTopicFacetItem : () => {},
            setQuery                     : () => {},
            setQueryFields               : () => {},
        },
        getters : {
            query                   : () => 'something',
            queryFields             : () => QUERY_FIELDS_ALL,
            selectedTopicFacetItems : () => SELECTED_TOPIC_FACET_ITEMS,
        },
    };

    const store = new Vuex.Store( merge( defaultStoreOptions, storeOverrides ) );

    const defaultMountingOptions = {
        propsData : {
            display       : true,
            queryFieldsUI : QUERY_FIELDS_UI,
        },
        localVue,
        store,
    };

    return shallowMount( SearchEcho, merge( defaultMountingOptions, mountingOverrides ) );
}

describe( 'SearchEcho', () => {
    const SEARCH_DCI_DISMISS_EVENT = 'search-dci-dismiss';

    test( 'does not display search DCI when query is empty', () => {
        const storeOverrides = {
            getters : {
                query : () => '',
            },
        };

        const wrapper = createWrapper( storeOverrides );

        expect( wrapper.find( SEARCH_DCI_SELECTOR ).isVisible() ).toBeFalsy();
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

    test( 'dismissing search DCI sets query to empty string if no topics selected', () => {
        const mockSetQuery = jest.fn();
        const storeOverrides = {
            actions : {
                setQuery : mockSetQuery,
            },
            getters : {
                selectedTopicFacetItems : () => [],
            },
        };

        const wrapper = createWrapper( storeOverrides );

        wrapper.find( SEARCH_DCI_SELECTOR ).trigger( 'click' );

        expect( mockSetQuery.mock.calls[ 0 ][ 1 ] ).toBe( '' );
    } );

    test( 'dismissing search DCI sets query to * if topics selected', () => {
        const mockSetQuery = jest.fn();
        const storeOverrides = {
            actions : {
                setQuery : mockSetQuery,
            },
        };

        const wrapper = createWrapper( storeOverrides );

        wrapper.find( SEARCH_DCI_SELECTOR ).trigger( 'click' );

        expect( mockSetQuery.mock.calls[ 0 ][ 1 ] ).toBe( '*' );
    } );

    test( `dismissing search DCI emits "${ SEARCH_DCI_DISMISS_EVENT }" event`, () => {
        const wrapper = createWrapper();

        wrapper.find( SEARCH_DCI_SELECTOR ).trigger( 'click' );

        expect( wrapper.emitted()[ SEARCH_DCI_DISMISS_EVENT ][ 0 ][ 0 ] ).toEqual( SEARCH_DCI_ID );
    } );

    test( 'dismissing topic DCI calls removeSelectedTopicFacetItem with correct arguments', () => {
        const mockRemoveSelectedTopicFacetItem = jest.fn();
        const storeOverrides = {
            actions : {
                removeSelectedTopicFacetItem : mockRemoveSelectedTopicFacetItem,
            },
        };

        const wrapper = createWrapper( storeOverrides );

        const TOPIC_TO_DISMISS = SELECTED_TOPIC_FACET_ITEMS[ 2 ];

        wrapper.find( `button[ id = "${ TOPIC_TO_DISMISS }" ]` ).trigger( 'click' );

        expect( mockRemoveSelectedTopicFacetItem.mock.calls[ 0 ][ 1 ] ).toBe( TOPIC_TO_DISMISS );
    } );
} );
