import SearchForm from '@/components/SearchForm';
import { createLocalVueWithVuex, queryFieldsUI } from '../test-utils';

import mergeWith from 'lodash.mergeWith';
import { shallowMount } from '@vue/test-utils';
import Vuex from 'vuex';

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
            query                   : () => 'something',
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
} );
