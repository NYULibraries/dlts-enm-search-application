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
    const epubClickEvent = 'epub-click';
    const results = require( '../fixtures/solr-responses/solr-search-results-groups.json' );

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
                numBooks : results.length,
                numPages : results.map( ( group ) => group.doclist.numFound )
                    .reduce( ( accumulator, currentValue ) => accumulator + currentValue ),
                results  : results,
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

    test( `emits "${ epubClickEvent }" when result is clicked`, () => {
        simulateSearch();

        const epubId    = results[ 7 ].groupValue;
        const epubTitle = results[ 7 ].doclist.docs[ 0 ].title;

        wrapper.find( `[ id = "${ epubId }" ]` ).trigger( 'click' );

        expect( wrapper.emitted()[ epubClickEvent ][ 0 ] ).toEqual( [ epubId, epubTitle ] );
    } );

    test( 'renders error condition correctly', () => {
        simulateError();

        expect( wrapper.element ).toMatchSnapshot();
    } );
} );
