import BarChart from '@/components/BarChart';
import PreviewPane from '@/components/PreviewPane';

import merge from 'lodash.merge';
import { shallowMount } from '@vue/test-utils';

import { createLocalVueWithVuex, createStore } from '../test-utils';

const ISBN                             = '9781111111111';
const QUERY                            = 'art';
const QUERY_FIELDS                     = [ 'pageText', 'topicNames' ];
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
            store = createStore( QUERY, QUERY_FIELDS, SELECTED_TOPIC_FIELD_FACET_ITEMS );

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
        const SELECTED_PAGE_NUMBER = 12;

        let localVue;
        let store;
        let wrapper;

        beforeEach( () => {
            localVue = createLocalVueWithVuex();
            store = createStore( QUERY, QUERY_FIELDS, SELECTED_TOPIC_FIELD_FACET_ITEMS );

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
