import BarChart from '@/components/BarChart';
import PreviewPane from '@/components/PreviewPane';

import merge from 'lodash.merge';
import { createLocalVue, shallowMount } from '@vue/test-utils';
import Vuex from 'vuex';

const ISBN_BEFORE_BOOK_SELECTED  = '';
const TITLE_BEFORE_BOOK_SELECTED = '';

function createWrapper( overrides ) {
    const defaultMountingOptions = {
        propsData : {
            display : false,
            isbn    : ISBN_BEFORE_BOOK_SELECTED,
            title   : TITLE_BEFORE_BOOK_SELECTED,
        },
    };

    return shallowMount( PreviewPane, merge( defaultMountingOptions, overrides ) );
}

describe( 'PreviewPane', () => {
    describe( 'initialized with no book selected', () => {
        const LOAD_FIRST_MATCHED_PAGE_LINK_CLICK_EVENT = 'load-first-matched-page-link-click';

        let wrapper;

        beforeEach( () => {
            wrapper = createWrapper();
        } );

        test( 'has correct display prop', () => {
            expect( wrapper.vm.display ).toBeFalsy();
        } );

        test( 'has correct isbn prop', () => {
            expect( wrapper.vm.isbn ).toBe( ISBN_BEFORE_BOOK_SELECTED );
        } );

        test( 'has correct title prop', () => {
            expect( wrapper.vm.isbn ).toBe( TITLE_BEFORE_BOOK_SELECTED );
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
        const MOCK_SOLR_RESPONSE_DOCS         = [
            {
                'pageNumberForDisplay' : '5',
                'score'                : 2.6782167,
            },
            {
                'pageNumberForDisplay' : '19',
                'score'                : 2.6782167,
            },
            {
                'pageNumberForDisplay' : '126',
                'score'                : 4.766254,
            },
            {
                'pageNumberForDisplay' : '192',
                'score'                : 5.5347614,
            },
            {
                'pageNumberForDisplay' : '218',
                'score'                : 4.7891774,
            },
        ];
        const EXPECTED_BAR_CHART_DATA = MOCK_SOLR_RESPONSE_DOCS.map( doc => {
            return {
                page  : doc.pageNumberForDisplay,
                score : doc.score,
            };
        } );
        const ISBN                             = '9781111111111';
        const QUERY                            = 'art';
        const QUERY_FIELDS                     = [ 'pageText', 'topicNames' ];
        const SELECTED_TOPIC_FIELD_FACET_ITEMS = [ 'art', 'drawing', 'painting' ];
        const TITLE                            = 'The Book';

        const getters = {
            query                   : () => QUERY,
            queryFields             : () => QUERY_FIELDS,
            selectedTopicFacetItems : () => SELECTED_TOPIC_FIELD_FACET_ITEMS,
        };

        let store;
        let wrapper;

        const localVue = createLocalVue();

        localVue.use( Vuex );

        beforeEach( () => {
            store = new Vuex.Store(
                {
                    getters,
                }
            );

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

            wrapper.setProps(
                {
                    display : true,
                    isbn    : ISBN,
                    title   : TITLE,
                }
            );
        } );

        test( 'calls $solrPreviewEpub with proper arguments', () => {
            expect( wrapper.vm.$solrPreviewEpub.mock.calls[ 0 ] ).toEqual(
                [
                    ISBN,
                    QUERY,
                    QUERY_FIELDS,
                    SELECTED_TOPIC_FIELD_FACET_ITEMS,
                ]
            );
        } );

        test( 'has correct display prop', () => {
            expect( wrapper.vm.display ).toBeTruthy();
        } );

        test( 'has correct isbn prop', () => {
            expect( wrapper.vm.isbn ).toBe( ISBN );
        } );

        test( 'has correct title prop', () => {
            expect( wrapper.vm.title ).toBe( TITLE );
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
                  require( '../fixtures/solr-responses/solr-preview-page-highlights-in-pagetext-and-topicnames' );
        const ISBN                             = '9781111111111';
        const QUERY                            = 'art';
        const QUERY_FIELDS                     = [ 'pageText', 'topicNames' ];
        const SELECTED_PAGE_NUMBER             = 12;
        const SELECTED_TOPIC_FIELD_FACET_ITEMS = [ 'art', 'drawing', 'painting' ];
        const TITLE                            = 'The Book';

        const getters = {
            query                   : () => QUERY,
            queryFields             : () => QUERY_FIELDS,
            selectedTopicFacetItems : () => SELECTED_TOPIC_FIELD_FACET_ITEMS,
        };

        let store;
        let wrapper;

        const localVue = createLocalVue();

        localVue.use( Vuex );

        beforeEach( () => {
            store = new Vuex.Store(
                {
                    getters,
                }
            );

            const $solrPreviewEpub = jest.fn();

            const $solrPreviewPage = jest.fn().mockReturnValueOnce(
                MOCK_SOLR_RESPONSE_PREVIEW_PAGE
            );

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

            wrapper.setProps(
                {
                    display : true,
                    isbn    : ISBN,
                    title   : TITLE,
                }
            );

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
                    QUERY_FIELDS,
                ]
            );
        } );

        test( 'renders correctly selected page', () => {
            expect( wrapper.element ).toMatchSnapshot();
        } );
    } );
} );
