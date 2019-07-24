import Spinner from '@/components/Spinner';

import { shallowMount } from '@vue/test-utils';

describe( 'Spinner', () => {
    let wrapper;

    beforeEach( () => {
        wrapper = shallowMount( Spinner, {
            propsData : {
                display : false,
            },
        } );
    } );

    test( 'displays and hides correctly', () => {
        expect( wrapper.isVisible() ).toBeFalsy();

        wrapper.setProps( { display : true } );

        expect( wrapper.isVisible() ).toBeTruthy();

        wrapper.setProps( { display : false } );

        expect( wrapper.isVisible() ).toBeFalsy();
    } );

    test( 'renders correctly when displayed', () => {
        wrapper.setProps( { display : true } );

        expect( wrapper.element ).toMatchSnapshot();
    } );
} );
