import FacetPane from '@/components/FacetPane';

import merge from 'lodash.merge';
import { shallowMount } from '@vue/test-utils';

const NUM_TOPICS_IN_DEFAULT_TOPICS_FACET_LIST = 25;
const DEFAULT_TOPICS_FACET_LIST = [];
for ( let i = 1; i < NUM_TOPICS_IN_DEFAULT_TOPICS_FACET_LIST; i++ ) {
    DEFAULT_TOPICS_FACET_LIST.push( {
        name    : 'topic' + i,
        numHits : 5 * ( NUM_TOPICS_IN_DEFAULT_TOPICS_FACET_LIST - i ),
    } );
}

const DEFAULT_TOPICS_FACET_LIST_LIMIT = 15;

function createWrapper( overrides ) {
    const defaultMountingOptions = {
        propsData : {
            display              : false,
            topicsFacetList      : DEFAULT_TOPICS_FACET_LIST,
            topicsFacetListLimit : DEFAULT_TOPICS_FACET_LIST_LIMIT,
        },
    };
    return shallowMount( FacetPane, merge( defaultMountingOptions, overrides ) );
}

describe( 'FacetPane', () => {
    describe( 'initialized', () => {
        let wrapper;

        beforeEach( () => {
            wrapper = createWrapper();
        } );
        test( 'has correct showAllTopics', () => {
            expect( wrapper.vm.showAllTopics ).toBeFalsy();
        } );

        test( 'has correct topicFacetItemsAlwaysVisible', () => {
            expect( wrapper.vm.topicFacetItemsAlwaysVisible )
                .toEqual(
                    DEFAULT_TOPICS_FACET_LIST.slice( 0, DEFAULT_TOPICS_FACET_LIST_LIMIT )
                );
        } );

        test( 'has correct topicFacetItemsToggleable', () => {
            expect( wrapper.vm.topicFacetItemsToggleable ).toEqual( [] );
        } );

        test( 'renders correctly', () => {
            expect( wrapper.element ).toMatchSnapshot();
        } );
    } );
    describe( 'click See All', () => {
        let wrapper;

        beforeEach( () => {
            wrapper = createWrapper();

            wrapper.find( '#see-all-link' ).trigger( 'click' );
        } );
        test( 'has correct showAllTopics', () => {
            expect( wrapper.vm.showAllTopics ).toBeTruthy();
        } );

        test( 'has correct topicFacetItemsAlwaysVisible', () => {
            expect( wrapper.vm.topicFacetItemsAlwaysVisible )
                .toEqual(
                    DEFAULT_TOPICS_FACET_LIST.slice( 0, DEFAULT_TOPICS_FACET_LIST_LIMIT )
                );
        } );

        test( 'has correct topicFacetItemsToggleable', () => {
            expect( wrapper.vm.topicFacetItemsToggleable ).toEqual(
                DEFAULT_TOPICS_FACET_LIST.slice( DEFAULT_TOPICS_FACET_LIST_LIMIT )
            );
        } );

        test( 'renders correctly', () => {
            expect( wrapper.element ).toMatchSnapshot();
        } );
    } );
} );
