import BarChart from '@/components/BarChart';
import PreviewPane from '@/components/PreviewPane';

import merge from 'lodash.merge';
import { shallowMount } from '@vue/test-utils';

import { createLocalVueWithVuex, createReadonlyStore } from '../test-utils';

const ISBN                             = '9781111111111';
const QUERY                            = 'art';
const QUERY_FIELDS_ALL                 = [ 'pageText', 'topicNames' ];
const QUERY_FIELDS_PAGE_TEXT_ONLY      = [ 'pageText' ];
const QUERY_FIELDS_TOPIC_NAMES_ONLY    = [ 'topicNames' ];
const SELECTED_TOPIC_FIELD_FACET_ITEMS = [ 'art', 'drawing', 'painting' ];
const TITLE                            = 'The Book';

function createWrapper( overrides ) {
    const defaultMountingOptions = {
        propsData : {
            display : false,
            isbn    : '',
            title   : '',
        },
    };

    return shallowMount( PreviewPane, merge( defaultMountingOptions, overrides ) );
}

function simulateClickingEpubInSearchResults( previewPaneWrapper, isbn, title ) {
    previewPaneWrapper.setProps(
        {
            display : true,
            isbn,
            title,
        }
    );
}

describe( 'PreviewPane', () => {
    describe( 'initialized with no book selected', () => {
        const LOAD_FIRST_MATCHED_PAGE_LINK_CLICK_EVENT = 'load-first-matched-page-link-click';

        let wrapper;

        beforeEach( () => {
            wrapper = createWrapper();
        } );

        test( `clicking on "Load the first matched page" emits "${ LOAD_FIRST_MATCHED_PAGE_LINK_CLICK_EVENT }" event`,
            () => {
                wrapper.find( '#load-first-matched-page-link' ).trigger( 'click' );

                expect( wrapper.emitted()[ LOAD_FIRST_MATCHED_PAGE_LINK_CLICK_EVENT ] ).toBeTruthy();
            }
        );

        test( 'renders correctly', () => {
            expect( wrapper.element ).toMatchSnapshot();
        } );
    } );

    describe( 'when a new book is selected', () => {
        const MOCK_SOLR_RESPONSE_DOCS = require( '../fixtures/solr-responses/solr-preview-epub-docs' );
        const EXPECTED_BAR_CHART_DATA = MOCK_SOLR_RESPONSE_DOCS.map( doc => {
            return {
                page  : doc.pageNumberForDisplay,
                score : doc.score,
            };
        } );

        let localVue;
        let store;
        let wrapper;

        beforeEach( () => {
            localVue = createLocalVueWithVuex();
            store = createReadonlyStore( QUERY, QUERY_FIELDS_ALL, SELECTED_TOPIC_FIELD_FACET_ITEMS );

            const $solrPreviewEpub = jest.fn().mockReturnValueOnce(
                {
                    'response' : {
                        'docs' : MOCK_SOLR_RESPONSE_DOCS,
                    },
                }
            );

            wrapper = createWrapper(
                {
                    mocks : {
                        $solrPreviewEpub,
                    },
                    store,
                    localVue,
                }
            );

            simulateClickingEpubInSearchResults( wrapper, ISBN, TITLE );
        } );

        test( 'calls $solrPreviewEpub with proper arguments', () => {
            expect( wrapper.vm.$solrPreviewEpub.mock.calls[ 0 ] ).toEqual(
                [
                    ISBN,
                    QUERY,
                    QUERY_FIELDS_ALL,
                    SELECTED_TOPIC_FIELD_FACET_ITEMS,
                ]
            );
        } );

        // We only need to test barChart.barChartData.
        // barChart.isbn and barChart.title are generally set one time only
        // through BarChart props assignment in template.
        test( 'passes BarChart component correct barChartData', () => {
            const barChartStub = wrapper.find( BarChart );
            expect( barChartStub.vm.barChartData ).toEqual( EXPECTED_BAR_CHART_DATA );
        } );
    } );

    describe( 'when BarChart emits a "bar-click" event', () => {
        const MOCK_SOLR_RESPONSE_PREVIEW_PAGE  =
                  require( '../fixtures/solr-responses/solr-preview-page-with-highlights-in-pagetext-and-topicnames' );
        const MOCK_SOLR_RESPONSE_PREVIEW_PAGE_WITH_HIGHLIGHTS_IN_PAGE_TEXT_ONLY =
                  require( '../fixtures/solr-responses/solr-preview-page-with-highlights-in-pagetext-only' );
        const MOCK_SOLR_RESPONSE_PREVIEW_PAGE_WITH_HIGHLIGHTS_IN_TOPIC_NAMES_ONLY =
                  require( '../fixtures/solr-responses/solr-preview-page-with-highlights-in-topicnames-only' );
        const SELECTED_PAGE_NUMBER = 12;

        const $solrPreviewEpub = jest.fn();
        const $solrPreviewPage = jest.fn( ( isbn, selectedPageNumber, query, queryFields ) => {
            let response;

            switch ( queryFields ) {
            case QUERY_FIELDS_ALL :
                response = MOCK_SOLR_RESPONSE_PREVIEW_PAGE;
                break;
            case QUERY_FIELDS_PAGE_TEXT_ONLY :
                response = MOCK_SOLR_RESPONSE_PREVIEW_PAGE_WITH_HIGHLIGHTS_IN_PAGE_TEXT_ONLY;
                break;
            case QUERY_FIELDS_TOPIC_NAMES_ONLY :
                response = MOCK_SOLR_RESPONSE_PREVIEW_PAGE_WITH_HIGHLIGHTS_IN_TOPIC_NAMES_ONLY;
                break;
            default :
            // Should never get here
            }

            return response;
        } );

        let localVue;
        let store;
        let wrapper;

        beforeEach( () => {
            localVue = createLocalVueWithVuex();

            $solrPreviewEpub.mockClear();
            $solrPreviewPage.mockClear();
        } );

        describe( 'for a page hit with highlights in both page text and topic names', () => {
            beforeEach( () => {
                store = createReadonlyStore( QUERY, QUERY_FIELDS_ALL, SELECTED_TOPIC_FIELD_FACET_ITEMS );

                wrapper = createWrapper(
                    {
                        mocks : {
                            $solrPreviewEpub,
                            $solrPreviewPage,
                        },
                        store,
                        localVue,
                    }
                );

                simulateClickingEpubInSearchResults( wrapper, ISBN, TITLE );

                wrapper.find( BarChart ).vm.$emit(
                    'bar-click',
                    SELECTED_PAGE_NUMBER
                );
            } );

            test( 'calls $solrPreviewPage with proper arguments', () => {
                expect( wrapper.vm.$solrPreviewPage.mock.calls[ 0 ] ).toEqual(
                    [
                        ISBN,
                        SELECTED_PAGE_NUMBER,
                        QUERY,
                        QUERY_FIELDS_ALL,
                    ]
                );
            } );

            test( 'renders preview correctly', () => {
                expect( wrapper.element ).toMatchSnapshot();
            } );
        } );

        describe( 'for a page hit with highlights in page text only', () => {
            beforeEach( () => {
                store = createReadonlyStore( QUERY, QUERY_FIELDS_PAGE_TEXT_ONLY, SELECTED_TOPIC_FIELD_FACET_ITEMS );

                wrapper = createWrapper(
                    {
                        mocks : {
                            $solrPreviewEpub,
                            $solrPreviewPage,
                        },
                        store,
                        localVue,
                    }
                );

                simulateClickingEpubInSearchResults( wrapper, ISBN, TITLE );

                wrapper.find( BarChart ).vm.$emit(
                    'bar-click',
                    SELECTED_PAGE_NUMBER
                );
            } );

            test( 'calls $solrPreviewPage with proper arguments', () => {
                expect( wrapper.vm.$solrPreviewPage.mock.calls[ 0 ] ).toEqual(
                    [
                        ISBN,
                        SELECTED_PAGE_NUMBER,
                        QUERY,
                        QUERY_FIELDS_PAGE_TEXT_ONLY,
                    ]
                );
            } );

            test( 'renders preview correctly', () => {
                expect( wrapper.element ).toMatchSnapshot();
            } );
        } );

        describe( 'for a page hit with highlights in topic names only', () => {
            beforeEach( () => {
                store = createReadonlyStore( QUERY, QUERY_FIELDS_TOPIC_NAMES_ONLY, SELECTED_TOPIC_FIELD_FACET_ITEMS );

                wrapper = createWrapper(
                    {
                        mocks : {
                            $solrPreviewEpub,
                            $solrPreviewPage,
                        },
                        store,
                        localVue,
                    }
                );

                simulateClickingEpubInSearchResults( wrapper, ISBN, TITLE );

                wrapper.find( BarChart ).vm.$emit(
                    'bar-click',
                    SELECTED_PAGE_NUMBER
                );
            } );

            test( 'calls $solrPreviewPage with proper arguments', () => {
                expect( wrapper.vm.$solrPreviewPage.mock.calls[ 0 ] ).toEqual(
                    [
                        ISBN,
                        SELECTED_PAGE_NUMBER,
                        QUERY,
                        QUERY_FIELDS_TOPIC_NAMES_ONLY,
                    ]
                );
            } );

            test( 'renders preview correctly', () => {
                expect( wrapper.element ).toMatchSnapshot();
            } );
        } );
    } );

    test( 'renders user-friendly preview error when $solrPreviewEpub returns an error', () => {
        const localVue = createLocalVueWithVuex();

        const $solrPreviewEpub = jest.fn().mockImplementation( () => {
            throw new Error();
        } );

        const wrapper = createWrapper(
            {
                mocks : {
                    $solrPreviewEpub,
                },
                localVue,
            }
        );

        simulateClickingEpubInSearchResults( wrapper, ISBN, TITLE );

        expect( wrapper.element ).toMatchSnapshot();
    } );

    test( 'renders user-friendly preview error when $solrPreviewPage returns an error', () => {
        const localVue = createLocalVueWithVuex();

        const $solrPreviewPage = jest.fn().mockImplementation( () => {
            throw new Error();
        } );

        const wrapper = createWrapper(
            {
                mocks : {
                    $solrPreviewPage,
                },
                localVue,
            }
        );

        // Simulate clicking of a bar, any bar
        wrapper.find( BarChart ).vm.$emit(
            'bar-click',
            1
        );

        expect( wrapper.element ).toMatchSnapshot();
    } );
} );
