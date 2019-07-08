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

        test( 'has correct display prop', () => {
            expect( wrapper.vm.display ).toBeTruthy();
        } );

        test( 'has correct isbn prop', () => {
            expect( wrapper.vm.isbn ).toBe( ISBN );
        } );

        test( 'has correct title prop', () => {
            expect( wrapper.vm.title ).toBe( TITLE );
        } );
    } );
} );
