import App from '@/App';
import FacetPane from '@/components/FacetPane';
import PreviewPane from '@/components/PreviewPane';
import ResultsPane from '@/components/ResultsPane';
import SearchEcho from '@/components/SearchEcho';
import SearchForm from '@/components/SearchForm';
import Spinner from '@/components/Spinner';

import { shallowMount } from '@vue/test-utils';
import merge from 'lodash.merge';
import Vuex from 'vuex';
import { createLocalVueWithVuex } from '../test-utils';

const QUERY                      = 'something';
const QUERY_FIELDS_FULL_TEXT     = 'pageText';
const QUERY_FIELDS_TOPIC_NAMES   = 'topicNames';
const QUERY_FIELDS_ALL           = Object.freeze( [ QUERY_FIELDS_FULL_TEXT, QUERY_FIELDS_TOPIC_NAMES ] );
const SELECTED_TOPIC_FACET_ITEMS = Object.freeze( [ 'topic 0', 'topic 1', 'topic 2', 'topic 3' ] );

function createWrapper( storeOverrides, mountingOverrides ) {
    const localVue = createLocalVueWithVuex();
    const defaultStoreOptions = {
        actions : {
            clearSelectedTopicFacetItems : () => {},
            setQuery                     : () => {},
            setQueryFields               : () => {},
            setSelectedTopicFacetItems   : () => {},
        },
        getters : {
            query                   : () => '',
            queryFields             : () => QUERY_FIELDS_ALL,
            selectedTopicFacetItems : () => [],
        },
    };

    const store = new Vuex.Store( merge( defaultStoreOptions, storeOverrides ) );

    const defaultMountingOptions = {
        localVue,
        store,
    };

    return shallowMount( App, merge( defaultMountingOptions, mountingOverrides ) );
}

describe( 'App', () => {
    test( 'sets visibility of panes correctly on initialization', () => {
        const wrapper = createWrapper();

        // Using .vm.display instead of .isVisible() because often the components
        // are not hiding the root element but instead are toggling the visibility
        // of child elements that containt the content.  This causes .isVisible()
        // to always return true for stubbed components.
        // Note that SearchForm is always visible and doesn't have a display prop.
        expect( wrapper.find( SearchEcho ).vm.display ).toBeTruthy();
        expect( wrapper.find( FacetPane ).vm.display ).toBeFalsy();
        expect( wrapper.find( ResultsPane ).vm.display ).toBeFalsy();
        expect( wrapper.find( PreviewPane ).vm.display ).toBeFalsy();
        expect( wrapper.find( Spinner ).vm.display ).toBeFalsy();
    } );

    describe( 'when SearchForm emits submit event', () => {
        const mockClearSelectedTopicFacetItems = jest.fn();

        let wrapper;

        beforeEach( () => {
            mockClearSelectedTopicFacetItems.mockRestore();

            const storeOverrides = {
                actions : {
                    clearSelectedTopicFacetItems : mockClearSelectedTopicFacetItems,
                },
                getters : {
                    query : () => QUERY,
                },
            };

            wrapper = createWrapper( storeOverrides );

            wrapper.find( SearchForm ).vm.$emit( 'submit' );
        } );

        test( 'clearSelectedTopicFacetItems is called', () => {
            expect( mockClearSelectedTopicFacetItems ).toHaveBeenCalled();
        } );

        test( 'new search is submitted and $solrSearch is called with correct arguments', () => {

        } );

        test( 'FacetPane props and visibility are set correctly', () => {

        } );

        test( 'ResultsPane props and visibility are set correctly', () => {

        } );

        test( 'PreviewPane props and visibility are set correctly', () => {

        } );
    } );
} );
