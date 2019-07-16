import ResultsPane from '@/components/ResultsPane';

import merge from 'lodash.merge';
import { shallowMount } from '@vue/test-utils';

function createWrapper( overrides ) {
    const defaultMountingOptions = {
        propsData : {
            display  : false,
            error    : false,
            numBooks : 0,
            numPages : 0,
            results  : [],
        },
    };

    return shallowMount( ResultsPane, merge( defaultMountingOptions, overrides ) );
}

describe( 'ResultsPane', () => {
    const EPUB_CLICK_EVENT = 'epub-click';

    const RESULTS = require( '../fixtures/solr-responses/solr-search-results-groups.json' );

    let wrapper;

    function simulateError() {
        wrapper.setProps(
            {
                display : true,
                error   : true,
            }
        );
    }

    function simulateSearch() {
        wrapper.setProps(
            {
                display  : true,
                numBooks : RESULTS.length,
                numPages : RESULTS.map( ( group ) => group.doclist.numFound )
                    .reduce( ( accumulator, currentValue ) => accumulator + currentValue ),
                results  : RESULTS,
            }
        );
    }

    beforeEach( () => {
        wrapper = createWrapper();
    } );

    test( 'renders no results found correctly', () => {
        wrapper.setProps(
            {
                display  : true,
                numBooks : 0,
                numPages : 0,
                results  : [],
            }
        );

        expect( wrapper.element ).toMatchSnapshot();
    } );

    test( 'renders results correctly', () => {
        simulateSearch();

        expect( wrapper.element ).toMatchSnapshot();
    } );

    test( `emits "${ EPUB_CLICK_EVENT }" when result is clicked`, () => {
        simulateSearch();

        const EPUB_ID    = RESULTS[ 7 ].groupValue;
        const EPUB_TITLE = RESULTS[ 7 ].doclist.docs[ 0 ].title;

        wrapper.find( `[ id = "${ EPUB_ID }" ]` ).trigger( 'click' );

        expect( wrapper.emitted()[ EPUB_CLICK_EVENT ][ 0 ] ).toEqual( [ EPUB_ID, EPUB_TITLE ] );
    } );

    test( 'renders error condition correctly', () => {
        simulateError();

        expect( wrapper.element ).toMatchSnapshot();
    } );
} );
