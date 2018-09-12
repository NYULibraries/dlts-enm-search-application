/* global setup:false suite:false test:false */

import { assert } from 'chai';

import SearchPage from '../pageobjects/search.page';

suite( 'Search form', function () {
    setup( function () {
        SearchPage.open();
    } );

    test( '"Full Text" checkbox is checked by default', function () {
        assert(
            SearchPage.searchForm.fulltext.isSelected(),
            '"Full Text" checkbox is not checked'
        );
    } );

    test( '"Topics" checkbox is checked by default', function () {
        assert(
            SearchPage.searchForm.topics.isSelected(),
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
                SearchPage.resultsPane.header.text +
                    separator                      +
                    SearchPage.resultsPane.results._element.getText(),
                'Results: None' + separator + 'Please try another search.'
            );
        }
    );

    test(
        'Submitting query with neither "Full Text" nor "Topics" selected should bring up error dialog box',
        function () {
            SearchPage.searchForm.fulltext.click();
            if ( SearchPage.searchForm.fulltext.isSelected() ) {
                assert.fail( 'Failed to de-select "Topics" -- make sure "Topics" is selected by default.' );
            }

            SearchPage.searchForm.topics.click();
            if ( SearchPage.searchForm.topics.isSelected() ) {
                assert.fail( 'Failed to de-select "Topics" -- make sure "Topics" is selected by default.' );
            }

            SearchPage.search( 'anything' );

            assert.equal( SearchPage.alertText(), 'Please check one or more boxes: Full Text, Topics' );
        }
    );
} );
