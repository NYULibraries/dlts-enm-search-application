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

        test( 'renders correctly', () => {
            expect( wrapper.element ).toMatchSnapshot();
        } );
    } );

    describe( 'when a new book is selected', () => {
        const ISBN                             = '9781111111111';
        const QUERY                            = 'art';
        const QUERY_FIELDS                     = [ 'pageText', 'topicNames' ];
        const SELECTED_TOPIC_FIELD_FACET_ITEMS = [ 'art', 'drawing', 'painting' ];
        const TITLE                            = 'The Book';

        let getters;
        let store;
        let wrapper;

        const localVue = createLocalVue();

        localVue.use( Vuex );

        beforeEach( () => {
            getters = {
                query                   : () => QUERY,
                queryFields             : () => QUERY_FIELDS,
                selectedTopicFacetItems : () => SELECTED_TOPIC_FIELD_FACET_ITEMS,
            };

            store = new Vuex.Store(
                {
                    getters,
                }
            );

            wrapper = createWrapper( { store, localVue } );

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
