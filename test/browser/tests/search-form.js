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

    test(
        'Submitting query with neither "Full Text" nor "Topics" selected should bring up error dialog box',
        function () {
            // Need to click checkbox labels instead of checkboxes themselves.
            // Trying to click checkboxes produces an error like this:
            //
            //     Element <input type="checkbox" name="fulltextChx" id="fulltextChx" class="is-medium is-checkbox" value="pageText"> is not clickable at point (630, 106). Other element would receive the click: <label for="fulltextChx">...</label>

            SearchPage.searchForm.fulltextLabel.click();
            if ( SearchPage.searchForm.fulltextCheckbox.isSelected() ) {
                assert.fail( 'Failed to de-select "Topics" -- make sure "Topics" is selected by default.' );
            }

            SearchPage.searchForm.topicsLabel.click();
            if ( SearchPage.searchForm.topicsCheckbox.isSelected() ) {
                assert.fail( 'Failed to de-select "Topics" -- make sure "Topics" is selected by default.' );
            }

            SearchPage.search( 'anything' );

            assert.equal( SearchPage.alertText(), 'Please check one or more boxes: Full Text, Topics' );
        }
    );
} );
