import Vuex from 'vuex';
import { createLocalVue } from '@vue/test-utils';
import cloneDeep from 'lodash.clonedeep';
import storeConfig from '../../../src/store/store-config';

describe( 'store-config', () => {
    const sampleTopicFacetItems = [
        'topicFacetItem1',
        'topicFacetItem2',
        'topicFacetItem3',
    ];

    const sampleQuery = 'query';

    let store;

    beforeEach( () => {
        const localVue = createLocalVue();
        localVue.use( Vuex );

        const clonedStoreConfig = cloneDeep( storeConfig );

        store = new Vuex.Store( clonedStoreConfig );
    } );

    describe( 'addSelectedTopicFacetItem action', () => {
        test( 'adds topic facet item to selectedTopicFacetItems', () => {
            const sampleTopicFacetItem = sampleTopicFacetItems[ 0 ];

            store.dispatch( 'addSelectedTopicFacetItem', sampleTopicFacetItem );

            expect( store.getters.selectedTopicFacetItems ).toEqual( [ sampleTopicFacetItem ] );
        } );
    } );

    describe( 'clearSelectedTopicFacetItems action', () => {
        test( 'clears selectedTopicFacetItems', () => {
            store.dispatch( 'addSelectedTopicFacetItem', sampleTopicFacetItems[ 0 ] );
            store.dispatch( 'addSelectedTopicFacetItem', sampleTopicFacetItems[ 1 ] );
            store.dispatch( 'addSelectedTopicFacetItem', sampleTopicFacetItems[ 2 ] );

            expect( store.getters.selectedTopicFacetItems ).toEqual( sampleTopicFacetItems );

            store.dispatch( 'clearSelectedTopicFacetItems' );

            expect( store.getters.selectedTopicFacetItems ).toEqual( [] );
        } );
    } );

    describe( 'removeSelectedTopicFacetItem action', () => {
        test( 'removes facet item from selectedTopicFacetItem', () => {
            store.dispatch( 'addSelectedTopicFacetItem', sampleTopicFacetItems[ 0 ] );
            store.dispatch( 'addSelectedTopicFacetItem', sampleTopicFacetItems[ 1 ] );
            store.dispatch( 'addSelectedTopicFacetItem', sampleTopicFacetItems[ 2 ] );

            expect( store.getters.selectedTopicFacetItems ).toEqual( sampleTopicFacetItems );

            store.dispatch( 'removeSelectedTopicFacetItem', sampleTopicFacetItems[ 1 ] );

            expect( store.getters.selectedTopicFacetItems ).toEqual(
                [
                    sampleTopicFacetItems[ 0 ],
                    sampleTopicFacetItems[ 2 ],
                ] );
        } );
    } );

    describe( 'setQuery action', () => {
        test( 'sets query', () => {
            store.dispatch( 'setQuery', sampleQuery );

            expect( store.getters.query ).toEqual( sampleQuery );
        } );
    } );

    describe( 'setQueryFields action', () => {
        test( 'sets queryFields', () => {
            const queryFields = [
                'queryField1',
                'queryField2',
            ];

            store.dispatch( 'setQueryFields', queryFields );

            expect( store.getters.queryFields ).toEqual( queryFields );
        } );
    } );
} );
