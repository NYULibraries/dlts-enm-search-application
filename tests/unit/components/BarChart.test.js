import BarChart from '@/components/BarChart';

import { shallowMount } from '@vue/test-utils';

describe( 'BarChart', () => {
    // We can't test the bar chart itself as JSDOM doesn't support SVG
    test( 'renders HTML correctly', () => {
        const wrapper = shallowMount( BarChart, {
            propsData : {
                // Specify default data just for sake of realism.  At the moment
                // we are not testing the data or the bar chart because JSDOM
                // doesn't render SVG.
                barChartData : [
                    { page : 1,   score : 3.0145667 },
                    { page : 15,  score : 7.4542345 },
                    { page : 27,  score : 0.9873432 },
                    { page : 28,  score : 1.4353942 },
                    { page : 119, score : 5.0042349 },
                    { page : 345, score : 2.1153842 },
                    { page : 500, score : 4.5380039 },
                ],
                title        : 'The Book',
            },
        } );

        expect( wrapper.element ).toMatchSnapshot();
    } );
} );
