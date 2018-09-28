/* global setup:false suite:false test:false */

import { assert } from 'chai';
import SearchPage from '../pageobjects/search.page';

suite( 'Search Echo', function () {
    suite( 'Search DCI label', function () {
        setup( function () {
            SearchPage.open();
        } );

        test( 'Search DCI has correct label for full-text searches', function () {
            // Uncheck topics
            SearchPage.searchForm.topicsCheckbox.click();
            SearchPage.searchAndWaitForResults( 'art' );

            const label = SearchPage.searchEcho.searchDCI.label;
            const EXPECTED_LABEL = 'Searching full texts for';
            assert(
                label === EXPECTED_LABEL,
                `Search DCI label was "${label}"; was expecting ${EXPECTED_LABEL}`
            );
        } );

        test( 'Search DCI has correct label for topics searches', function () {
            // Uncheck fulltext
            SearchPage.searchForm.fulltextCheckbox.click();
            SearchPage.searchAndWaitForResults( 'art' );

            const label = SearchPage.searchEcho.searchDCI.label;
            const EXPECTED_LABEL = 'Searching topics for';
            assert(
                label === EXPECTED_LABEL,
                `Got search DCI label "${label}"; expected "${EXPECTED_LABEL}"`
            );
        } );

        test( 'Search DCI has correct label for full-text + topics searches by default', function () {
            SearchPage.searchAndWaitForResults( 'art' );

            const label = SearchPage.searchEcho.searchDCI.label;
            const EXPECTED_LABEL = 'Searching full texts and topics for';
            assert(
                label === EXPECTED_LABEL,
                `Got search DCI label "${label}"; expected "${EXPECTED_LABEL}"`
            );
        } );

        test( 'Search DCI has correct label for full-text + topics searches after user ' +
              'first disables then re-enables full-text', function () {
            // Prototype had bug where label was "Searching topics and full texts for"
            // if user first disabled then re-enabled full-text.
            SearchPage.searchForm.fulltextCheckbox.click();
            SearchPage.searchForm.fulltextCheckbox.click();
            SearchPage.searchAndWaitForResults( 'art' );

            const label = SearchPage.searchEcho.searchDCI.label;
            const EXPECTED_LABEL = 'Searching full texts and topics for';
            assert(
                label === EXPECTED_LABEL,
                `Got search DCI label "${label}"; expected "${EXPECTED_LABEL}"`
            );
        } );
    } );

    suite( 'Search DCI dismissal', function () {
        setup( function () {
            SearchPage.open();
        } );

        test( 'Change to blank search if no topic DCIs', function () {
            SearchPage.searchAndWaitForResults( 'art' );

            SearchPage.searchEcho.searchDCI.dismiss();

            // Make exception to one-assert-per-test
            const query = SearchPage.searchForm.searchBox.getValue();
            assert(
                query === '',
                `Got query "${query}"; expected empty query`
            );

            assert(
                SearchPage.resultsPane.header.text === 'Results: None',
                'Results not empty after search DCI dismissal'
            );
        } );

        test( 'Change to "*" if topic DCIs', function () {
            SearchPage.searchAndWaitForResults( 'women' );
            SearchPage.limitByTopicAndWaitForResults( 'feminism' );

            SearchPage.searchEcho.searchDCI.dismiss();

            // Make exception to one-assert-per-test
            const searchBoxQuery = SearchPage.searchForm.searchBox.getValue();
            assert( searchBoxQuery === '*', `Got search form query "${searchBoxQuery}"; expected "*"` );

            const searchDCIQuery = SearchPage.searchEcho.searchDCI.query;
            assert( searchDCIQuery === '*', `Got search DCI query ${searchDCIQuery}; expected "*"` );
        } );

        test( 'Change to "*" if topic DCIs and reset Preview Pane if original query was not "*"', function () {
            SearchPage.searchAndWaitForResults( 'women' );
            SearchPage.limitByTopicAndWaitForResults( 'feminism' );
            SearchPage.previewPane.loadTheFirstMatchedPageLink.click();

            if ( SearchPage.previewPane.title !== 'American Cool' ) {
                assert.fail( 0, 1, 'Setup of test failed: preview pane not properly loaded' );
            }

            SearchPage.searchEcho.searchDCI.dismiss();

            // Make exception to one-assert-per-test
            const searchBoxQuery = SearchPage.searchForm.searchBox.getValue();
            assert( searchBoxQuery === '*', `Got search form query "${searchBoxQuery}"; expected "*"` );

            const searchDCIQuery = SearchPage.searchEcho.searchDCI.query;
            assert( searchDCIQuery === '*', `Got search DCI query ${searchDCIQuery}; expected "*"` );

            assert(
                SearchPage.previewPane.loadTheFirstMatchedPageLink.isVisible(),
                '"Load the first matched page" link is not visible'
            );
        } );
    } );
} );
