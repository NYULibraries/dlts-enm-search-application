import SearchForm from '@/components/SearchForm';
import {
    createLocalVueWithVuex,
    queryFieldsUI,
    queryFieldsUILabels,
    queryFieldsUIValues,
} from '../test-utils';

import mergeWith from 'lodash.mergeWith';
import { shallowMount } from '@vue/test-utils';
import Vuex from 'vuex';

const QUERY                      = 'something';
const QUERY_FIELDS_FULL_TEXT     = 'pageText';
const QUERY_FIELDS_TOPIC_NAMES   = 'topicNames';
const QUERY_FIELDS_ALL           = Object.freeze( [ QUERY_FIELDS_FULL_TEXT, QUERY_FIELDS_TOPIC_NAMES ] );

const SEARCH_INPUT_SELECTOR      = '#enm-searchinput';

function createWrapper( storeOverrides, mountingOverrides ) {
    const localVue = createLocalVueWithVuex();
    const defaultStoreOptions = {
        actions : {
            setQuery                     : () => {},
            setQueryFields               : () => {},
        },
        getters : {
            query                   : () => QUERY,
            queryFields             : () => QUERY_FIELDS_ALL,
        },
    };

    // Allow for empty objects and arrays in overrides to replace default values
    function customizer( objValue, srcValue ) {
        return srcValue || objValue;
    }

    const store = new Vuex.Store(
        mergeWith( defaultStoreOptions, storeOverrides, customizer )
    );

    const defaultMountingOptions = {
        propsData : {
            queryFieldsUI : queryFieldsUI(),
        },
        localVue,
        store,
    };

    const mergedMountingOptions = mergeWith(
        defaultMountingOptions, mountingOverrides, customizer
    );

    return shallowMount( SearchForm, mergedMountingOptions );
    // return shallowMount( SearchForm, merge( defaultMountingOptions, mountingOverrides ) );
}

describe( 'SearchForm', () => {
    describe( 'renders correctly when initialized', () => {
        test( 'with no queryFields', () => {
            const storeOverrides = {
                getters : {
                    queryFields : () => [],
                },
            };
            const mountingOverrides = {
                propsData : {
                    queryFieldsUI : [],
                },
            };
            const wrapper = createWrapper( storeOverrides, mountingOverrides );

            expect( wrapper.element ).toMatchSnapshot();
        } );

        test( 'with queryFields', () => {
            expect( createWrapper().element ).toMatchSnapshot();
        } );
    } );

    test( 'calls window.alert with correct arguments ' +
               'when search submitted with no query fields selected', () => {

        const storeOverrides = {
            getters : {
                query : () => '',
            },
        };

        const wrapper = createWrapper( storeOverrides );

        const spyAlert = jest.spyOn( window, 'alert' ).mockImplementation( () => {
            // noop
        } );

        queryFieldsUI().map( queryFieldUI => queryFieldUI.name )
            .forEach( ( queryField ) => {
                wrapper.find( `input[ id = "${ queryField }Chx" ]` ).setChecked( false );
            } );

        wrapper.find( 'form' ).trigger( 'submit' );

        expect( spyAlert ).toHaveBeenCalledWith(
            'Please check one or more boxes: ' + queryFieldsUILabels().join( ', ' )
        );

        spyAlert.mockRestore();
    } );

    describe( 'when search is submitted', () => {
        const SUBMIT_EVENT = 'submit';

        const mockSetQuery       = jest.fn();
        const mockSetQueryFields = jest.fn();

        let wrapper;

        beforeEach( () => {
            mockSetQuery.mockRestore();
            mockSetQueryFields.mockRestore();

            const storeOverrides = {
                actions : {
                    setQuery       : mockSetQuery,
                    setQueryFields : mockSetQueryFields,
                },
            };

            wrapper = createWrapper( storeOverrides );

            wrapper.find( SEARCH_INPUT_SELECTOR ).setValue( QUERY );

            wrapper.find( 'form' ).trigger( 'submit' );
        } );

        test( 'setQuery is called with correct arguments', () => {
            expect( mockSetQuery.mock.calls[ 0 ][ 1 ] ).toBe( QUERY );
        } );

        test( 'setQueryFields is called with correct arguments', () => {
            expect( mockSetQueryFields.mock.calls[ 0 ][ 1 ] ).toEqual( queryFieldsUIValues() );
        } );

        test( `"${ SUBMIT_EVENT }" is emitted`, () => {
            expect( wrapper.emitted() ).toHaveProperty( SUBMIT_EVENT );
        } );

        test( 'renders correctly', () => {
            expect( wrapper.element ).toMatchSnapshot();
        } );
    } );
} );
