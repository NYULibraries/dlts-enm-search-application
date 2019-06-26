import FacetPane from '@/components/FacetPane';

import merge from 'lodash.merge';
import { createLocalVue, shallowMount } from '@vue/test-utils';
import Vuex from 'vuex';

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
            display              : true,
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
    describe( 'click See Less', () => {
        let wrapper;

        beforeEach( () => {
            wrapper = createWrapper();

            wrapper.find( '#see-less-link' ).trigger( 'click' );
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
    test( 'clickTopicFacetItem calls addSelectedTopicFacetItem action with correct argument', () => {
        let actions;
        let mockAddSelectedTopicFacetItem = jest.fn();
        let store;

        let localVue;
        let wrapper;

        localVue = createLocalVue();

        localVue.use( Vuex );

        actions = {
            addSelectedTopicFacetItem : mockAddSelectedTopicFacetItem,
        };

        store = new Vuex.Store( {
            actions,
        } );

        wrapper = createWrapper( {
            localVue,
            store,
        } );

        const selectedTopicName1 = DEFAULT_TOPICS_FACET_LIST[ 7 ].name;
        const selectedTopicName2 = DEFAULT_TOPICS_FACET_LIST[ 2 ].name;
        const selectedTopicName3 = DEFAULT_TOPICS_FACET_LIST[ 12 ].name;

        wrapper.find( '#' + selectedTopicName1 ).trigger( 'click' );
        wrapper.find( '#' + selectedTopicName2 ).trigger( 'click' );
        wrapper.find( '#' + selectedTopicName3 ).trigger( 'click' );

        expect( mockAddSelectedTopicFacetItem.mock.calls[ 0 ][ 1 ] ).toBe( selectedTopicName1 );
        expect( mockAddSelectedTopicFacetItem.mock.calls[ 1 ][ 1 ] ).toBe( selectedTopicName2 );
        expect( mockAddSelectedTopicFacetItem.mock.calls[ 2 ][ 1 ] ).toBe( selectedTopicName3 );
    } );
    test( 'changing topicFacetList prop updates topics facet list', () => {
        const wrapper = createWrapper();

        const newTopicFacetList = [];
        for ( let i = 1; i < NUM_TOPICS_IN_DEFAULT_TOPICS_FACET_LIST * 2; i++ ) {
            newTopicFacetList.push( {
                name    : 'new-topic-' + i,
                numHits : 88,
            } );
        }

        wrapper.setProps( { topicsFacetList : newTopicFacetList } );

        expect( wrapper.vm.topicFacetItemsAlwaysVisible )
            .toEqual( newTopicFacetList.slice( 0, DEFAULT_TOPICS_FACET_LIST_LIMIT ) );
    } );
    test( 'changing topicFacetListLimit prop updates topics facet list', () => {
        const wrapper = createWrapper();

        const NEW_TOPICS_FACET_LIST_LIMIT = DEFAULT_TOPICS_FACET_LIST_LIMIT + 10;

        wrapper.setProps( { topicsFacetListLimit : NEW_TOPICS_FACET_LIST_LIMIT } );

        expect( wrapper.vm.topicFacetItemsAlwaysVisible )
            .toEqual( DEFAULT_TOPICS_FACET_LIST.slice( 0, NEW_TOPICS_FACET_LIST_LIMIT ) );
    } );
    test( 'setting display prop shows/hides the pane', () => {
        const wrapper = createWrapper();
        const facetsList = wrapper.find( '.enm-facets-list' );

        expect( facetsList.isVisible() ).toBe( true );

        wrapper.setProps( { display : false } );
        expect( facetsList.isVisible() ).toBe( false );

        wrapper.setProps( { display : true } );
        expect( facetsList.isVisible() ).toBe( true );
    } );
} );
