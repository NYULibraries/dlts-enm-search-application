import Vuex from 'vuex';
import { createLocalVue } from '@vue/test-utils';
import cloneDeep from 'lodash.clonedeep';
import storeConfig from '../../../src/store/store-config';

describe( 'store-config', () => {
    let store;

    beforeEach( () => {
        const localVue = createLocalVue();
        localVue.use( Vuex );

        const clonedStoreConfig = cloneDeep( storeConfig );

        store = new Vuex.Store( clonedStoreConfig );
    } );

    describe( 'selected topic facet items', () => {
        const sampleTopicFacetItems = [
            'topicFacetItem1',
            'topicFacetItem2',
            'topicFacetItem3',
        ];

        test( 'addSelectedTopicFacetItem mutation', () => {
            const sampleTopicFacetItem = sampleTopicFacetItems[ 0 ];

            store.commit( 'addSelectedTopicFacetItem', sampleTopicFacetItem );

            expect( store.getters.selectedTopicFacetItems ).toEqual( [ sampleTopicFacetItem ] );
        } );

        test( 'addSelectedTopicFacetItem action', () => {
            const sampleTopicFacetItem = sampleTopicFacetItems[ 0 ];

            store.dispatch( 'addSelectedTopicFacetItem', sampleTopicFacetItem );

            expect( store.getters.selectedTopicFacetItems ).toEqual( [ sampleTopicFacetItem ] );
        } );

        test( 'clearSelectedTopicFacetItems mutation', () => {
            store.commit( 'addSelectedTopicFacetItem', sampleTopicFacetItems[ 0 ] );
            store.commit( 'addSelectedTopicFacetItem', sampleTopicFacetItems[ 1 ] );
            store.commit( 'addSelectedTopicFacetItem', sampleTopicFacetItems[ 2 ] );

            expect( store.getters.selectedTopicFacetItems ).toEqual( sampleTopicFacetItems );

            store.commit( 'clearSelectedTopicFacetItems' );

            expect( store.getters.selectedTopicFacetItems ).toEqual( [] );
        } );

        test( 'clearSelectedTopicFacetItems action', () => {
            store.dispatch( 'addSelectedTopicFacetItem', sampleTopicFacetItems[ 0 ] );
            store.dispatch( 'addSelectedTopicFacetItem', sampleTopicFacetItems[ 1 ] );
            store.dispatch( 'addSelectedTopicFacetItem', sampleTopicFacetItems[ 2 ] );

            expect( store.getters.selectedTopicFacetItems ).toEqual( sampleTopicFacetItems );

            store.dispatch( 'clearSelectedTopicFacetItems' );

            expect( store.getters.selectedTopicFacetItems ).toEqual( [] );
        } );

        test( 'removeSelectedTopicFacetItem mutation', () => {
            store.commit( 'addSelectedTopicFacetItem', sampleTopicFacetItems[ 0 ] );
            store.commit( 'addSelectedTopicFacetItem', sampleTopicFacetItems[ 1 ] );
            store.commit( 'addSelectedTopicFacetItem', sampleTopicFacetItems[ 2 ] );

            expect( store.getters.selectedTopicFacetItems ).toEqual( sampleTopicFacetItems );

            store.commit( 'removeSelectedTopicFacetItem', sampleTopicFacetItems[ 1 ] );

            expect( store.getters.selectedTopicFacetItems ).toEqual(
                [
                    sampleTopicFacetItems[ 0 ],
                    sampleTopicFacetItems[ 2 ],
                ] );
        } );

        test( 'removeSelectedTopicFacetItem action', () => {
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

    describe( 'query', () => {
        const sampleQuery = 'query';

        test( 'setQuery mutation', () => {
            store.commit( 'setQuery', sampleQuery );

            expect( store.getters.query ).toEqual( sampleQuery );
        } );

        test( 'setQuery action', () => {
            store.dispatch( 'setQuery', sampleQuery );

            expect( store.getters.query ).toEqual( sampleQuery );
        } );

        test( 'setQueryFields mutation', () => {
            const queryFields = [
                'queryField1',
                'queryField2',
            ];

            store.commit( 'setQueryFields', queryFields );

            expect( store.getters.queryFields ).toEqual( queryFields );
        } );

        test( 'setQueryFields action', () => {
            const queryFields = [
                'queryField1',
                'queryField2',
            ];

            store.dispatch( 'setQueryFields', queryFields );

            expect( store.getters.queryFields ).toEqual( queryFields );
        } );
    } );

} );
