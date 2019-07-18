import SearchForm from '@/components/SearchForm';
import { createLocalVueWithVuex, queryFieldsUI, queryFieldsUILabels } from '../test-utils';

import mergeWith from 'lodash.mergeWith';
import { shallowMount } from '@vue/test-utils';
import Vuex from 'vuex';

const QUERY                      = 'something';
const QUERY_FIELDS_FULL_TEXT     = 'pageText';
const QUERY_FIELDS_TOPIC_NAMES   = 'topicNames';
const QUERY_FIELDS_ALL           = Object.freeze( [ QUERY_FIELDS_FULL_TEXT, QUERY_FIELDS_TOPIC_NAMES ] );

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
} );
