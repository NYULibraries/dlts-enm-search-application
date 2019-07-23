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

const EPUB_CLICK_EVENT                     = 'epub-click';
const SEARCH_ECHO_SEARCH_DCI_DISMISS_EVENT = 'search-dci-dismiss';

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

function getExpectedTopicFacetNames( solrResponseTopicNamesFacet, userSelectedTopicFacetItems ) {
    const mockSolrSearchResponseTopicNamesFacet = solrResponseTopicNamesFacet
        .facet_counts
        .facet_fields
        .topicNames_facet;

    const expectedTopicNamesFacet = [];
    for ( let i = 0; i < mockSolrSearchResponseTopicNamesFacet.length; i = i + 2 ) {
        const topicName = mockSolrSearchResponseTopicNamesFacet[ i ];
        const numHits   = mockSolrSearchResponseTopicNamesFacet[ i + 1 ].toString();
        if ( ! userSelectedTopicFacetItems.includes( topicName ) ) {
            expectedTopicNamesFacet.push(
                {
                    name    : topicName,
                    numHits : numHits,
                }
            );
        }
    }

    return expectedTopicNamesFacet;
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
        const MOCK_SOLR_SEARCH_RESPONSE = Object.freeze(
            require( '../fixtures/solr-responses/solr-search.json' )
        );
        const mockClearSelectedTopicFacetItems = jest.fn();
        const mockSolrSearch = jest.fn().mockImplementation(
            ( query, queryFields, selectedTopicFacetItems ) => {
                return MOCK_SOLR_SEARCH_RESPONSE;
            }
        );

        let wrapper;

        beforeEach( () => {
            mockClearSelectedTopicFacetItems.mockClear();
            mockSolrSearch.mockClear();

            const storeOverrides = {
                actions : {
                    clearSelectedTopicFacetItems : mockClearSelectedTopicFacetItems,
                },
                getters : {
                    query                   : () => QUERY,
                    selectedTopicFacetItems : () => SELECTED_TOPIC_FACET_ITEMS,
                },
            };

            const mountingOverrides = {
                mocks : {
                    $solrSearch : mockSolrSearch,
                },
            };

            wrapper = createWrapper( storeOverrides, mountingOverrides );

            wrapper.find( SearchForm ).vm.$emit( 'submit' );
        } );

        test( 'clearSelectedTopicFacetItems is called', () => {
            expect( mockClearSelectedTopicFacetItems ).toHaveBeenCalled();
        } );

        test( '$solrSearch is called with correct arguments', () => {
            expect( mockSolrSearch.mock.calls[ 0 ] ).toEqual(
                [
                    QUERY,
                    QUERY_FIELDS_ALL,
                    SELECTED_TOPIC_FACET_ITEMS,
                ],
            );
        } );

        test( 'FacetPane props and visibility are set correctly', () => {
            const expectedTopicNamesFacet = getExpectedTopicFacetNames(
                MOCK_SOLR_SEARCH_RESPONSE,
                SELECTED_TOPIC_FACET_ITEMS,
            );

            const facetPaneStub = wrapper.find( FacetPane );

            // See note about visibility testing in test
            // 'sets visibility of panes correctly on initialization'
            expect( facetPaneStub.vm.display ).toBeTruthy();

            expect( facetPaneStub.vm.topicsFacetList ).toEqual( expectedTopicNamesFacet );
        } );

        test( 'ResultsPane props and visibility are set correctly', () => {
            const resultsPaneStub = wrapper.find( ResultsPane );

            // See note about visibility testing in test
            // 'sets visibility of panes correctly on initialization'
            expect( resultsPaneStub.vm.display ).toBeTruthy();

            expect( resultsPaneStub.vm.numBooks ).toBe( MOCK_SOLR_SEARCH_RESPONSE.grouped.isbn.groups.length );
            expect( resultsPaneStub.vm.numPages ).toBe( MOCK_SOLR_SEARCH_RESPONSE.grouped.isbn.matches );
            expect( resultsPaneStub.vm.results ).toBe( MOCK_SOLR_SEARCH_RESPONSE.grouped.isbn.groups );
        } );

        test( 'PreviewPane props and visibility are set correctly', () => {
            expect( wrapper.find( PreviewPane ).vm.display ).toBeTruthy();
        } );
    } );

    test( `calls $solrSearch when SearchEcho emits ${ SEARCH_ECHO_SEARCH_DCI_DISMISS_EVENT } event`, () => {
        const mockSolrSearch = jest.fn();

        // When user dismisses search DCI with topic facet items selected, the
        // query is changed to "*".
        const WILDCARD_QUERY = '*';
        const storeOverrides = {
            getters : {
                query                   : () => WILDCARD_QUERY,
                selectedTopicFacetItems : () => SELECTED_TOPIC_FACET_ITEMS,
            },
        };

        const mountingOverrides = {
            mocks : {
                $solrSearch : mockSolrSearch,
            },
        };

        const wrapper = createWrapper( storeOverrides, mountingOverrides );

        wrapper.find( SearchEcho ).vm.$emit( SEARCH_ECHO_SEARCH_DCI_DISMISS_EVENT );

        expect( mockSolrSearch.mock.calls[ 0 ] ).toEqual(
            [
                WILDCARD_QUERY,
                QUERY_FIELDS_ALL,
                SELECTED_TOPIC_FACET_ITEMS,
            ],
        );
    } );

    test( `sets PreviewPane props correctly when ResultsPane emits "${ EPUB_CLICK_EVENT }"`, () => {
        const ISBN  = '9781111111111';
        const TITLE = 'The Book';

        const wrapper = createWrapper();

        wrapper.find( ResultsPane ).vm.$emit( EPUB_CLICK_EVENT, ISBN, TITLE );

        const previewPaneStub = wrapper.find( PreviewPane );
        expect( previewPaneStub.vm.isbn ).toBe( ISBN );
        expect( previewPaneStub.vm.title ).toBe( TITLE );
    } );
} );
