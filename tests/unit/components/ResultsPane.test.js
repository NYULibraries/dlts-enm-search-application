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
    let wrapper;

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
        const results =
            require( '../fixtures/solr-responses/solr-search-results-groups.json' );

        wrapper.setProps(
            {
                display  : true,
                numBooks : results.length,
                numPages : results.map( ( group ) => group.doclist.numFound )
                    .reduce( ( accumulator, currentValue ) => accumulator + currentValue ),
                results  : results
            }
        );

        expect( wrapper.element ).toMatchSnapshot();
    } );
} );
