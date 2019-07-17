import SearchEcho from '@/components/SearchEcho';

import { shallowMount } from '@vue/test-utils';
import merge from 'lodash.merge';
import Vuex from 'vuex';
import { createLocalVueWithVuex,queryFieldsUI } from '../test-utils';

const DCI_CONTAINER_SELECTOR     = 'span.tag';
const QUERY_FIELDS_FULL_TEXT     = 'pageText';
const QUERY_FIELDS_TOPIC_NAMES   = 'topicNames';
const QUERY_FIELDS_ALL           = Object.freeze( [ QUERY_FIELDS_FULL_TEXT, QUERY_FIELDS_TOPIC_NAMES ] );
const SEARCH_DCI_BUTTON_ID       = 'search-dci';
const SEARCH_DCI_SPAN_ID         = 'search-dci-span';
const SELECTED_TOPIC_FACET_ITEMS = Object.freeze( [ 'topic 0', 'topic 1', 'topic 2', 'topic 3' ] );

function createWrapper( storeOverrides, mountingOverrides ) {
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
            queryFieldsUI : queryFieldsUI(),
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

        expect( wrapper.find( `#${ SEARCH_DCI_BUTTON_ID }` ).isVisible() ).toBeFalsy();
    } );

    test( 'does not display topic DCIs when selectedTopicItems is empty', () => {
        const storeOverrides = {
            getters : {
                selectedTopicFacetItems : () => [],
            },
        };

        const wrapper = createWrapper( storeOverrides );

        // Only the search DCI should be displayed
        const dciContainers = wrapper.findAll( DCI_CONTAINER_SELECTOR );
        expect( dciContainers.length ).toBe( 1 );
        expect( dciContainers.wrappers[ 0 ].find( 'button' ).attributes().id ).toBe( SEARCH_DCI_BUTTON_ID );
    } );

    test( 'displays correct search DCI when query submitted against full-text only', () => {
        const storeOverrides = {
            getters : {
                queryFields : () => [ QUERY_FIELDS_FULL_TEXT ],
            },
        };

        const wrapper = createWrapper( storeOverrides );

        expect( wrapper.find( `#${ SEARCH_DCI_SPAN_ID }` ).text() ).toBe( 'Searching full texts for: something' );
    } );

    test( 'displays correct search DCI when query submitted against topics only', () => {
        const storeOverrides = {
            getters : {
                queryFields : () => [ QUERY_FIELDS_TOPIC_NAMES ],
            },
        };

        const wrapper = createWrapper( storeOverrides );

        expect( wrapper.find( `#${ SEARCH_DCI_SPAN_ID }` ).text() ).toBe( 'Searching topics for: something' );
    } );

    test( 'displays correct DCIs when query submitted against full-text and topics', () => {
        const wrapper = createWrapper();

        expect( wrapper.find( `#${ SEARCH_DCI_SPAN_ID }` ).text() ).toBe( 'Searching full texts and topics for: something' );
    } );

    test( 'displays correct DCIs when facet items are selected', () => {
        const wrapper = createWrapper();

        const topicFacetItemDCIs = wrapper.findAll( 'span.tag' ).wrappers.slice( 1 );

        for ( let i = 0; i < SELECTED_TOPIC_FACET_ITEMS.length; i++ ) {
            expect( topicFacetItemDCIs[ i ].text() )
                .toMatch( new RegExp( `^Topic:\\s+${ SELECTED_TOPIC_FACET_ITEMS[ i ] }$` ) );
        }
    } );

    test( 'renders correctly', () => {
        expect( createWrapper() ).toMatchSnapshot();
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

        wrapper.find( `#${ SEARCH_DCI_BUTTON_ID }` ).trigger( 'click' );

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

        wrapper.find( `#${ SEARCH_DCI_BUTTON_ID }` ).trigger( 'click' );

        expect( mockSetQuery.mock.calls[ 0 ][ 1 ] ).toBe( '*' );
    } );

    test( `dismissing search DCI emits "${ SEARCH_DCI_DISMISS_EVENT }" event`, () => {
        const wrapper = createWrapper();

        wrapper.find( `#${ SEARCH_DCI_BUTTON_ID }` ).trigger( 'click' );

        expect( wrapper.emitted()[ SEARCH_DCI_DISMISS_EVENT ][ 0 ][ 0 ] ).toEqual( SEARCH_DCI_BUTTON_ID );
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
