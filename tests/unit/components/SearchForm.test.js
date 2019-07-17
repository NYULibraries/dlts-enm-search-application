import SearchForm from '@/components/SearchForm';
import { createLocalVueWithVuex,queryFieldsUI } from '../test-utils';

import merge from 'lodash.merge';
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

    const store = new Vuex.Store( merge( defaultStoreOptions, storeOverrides ) );

    const defaultMountingOptions = {
        propsData : {
            queryFieldsUI : queryFieldsUI(),
        },
        localVue,
        store,
    };

    return shallowMount( SearchForm, merge( defaultMountingOptions, mountingOverrides ) );
}
describe( 'SearchForm', () => {
    test( 'renders correctly when initialized', () => {
        expect( createWrapper().element ).toMatchSnapshot();
    } );

} );
