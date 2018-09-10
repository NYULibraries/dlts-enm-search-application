/* global setup:false suite:false test:false */

import { assert } from 'chai';

import SearchPage from '../pageobjects/search.page';

suite( 'Search form', function () {
    setup( function () {
        SearchPage.open();
    } );

    test( '"Full Text" checkbox is checked by default', function () {
        assert(
            SearchPage.searchForm.fulltextCheckbox.isSelected(),
            '"Full Text" checkbox is not checked'
        );
    } );

    test( '"Topics" checkbox is checked by default', function () {
        assert(
            SearchPage.searchForm.topicsCheckbox.isSelected(),
            '"Topics" checkbox is not checked'
        );
    } );

    test( 'Spinner should appear when search is submitted', function () {
        SearchPage.search( 'anything' );

        assert( SearchPage.spinner.isVisible(), 'Spinner did not appear' );
    } );

    test(
        'Blank query should return zero results with suggestion to try another search',
        function () {
            const separator = ' ... ';

            SearchPage.search( '' );

            assert.equal(
                SearchPage.resultsPane.header.text + separator + SearchPage.resultsPane.results.text,
                'Results: None' + separator + 'Please try another search.'
            );
        }
    );
} );
