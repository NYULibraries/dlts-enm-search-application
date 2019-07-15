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
} );
