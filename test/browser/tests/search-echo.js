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
                `Search DCI label was "${label}"; was expecting ${EXPECTED_LABEL}`
            );
        } );

        test( 'Search DCI has correct label for full-text + topics searches by default', function () {
            SearchPage.searchAndWaitForResults( 'art' );

            const label = SearchPage.searchEcho.searchDCI.label;
            const EXPECTED_LABEL = 'Searching full texts and topics for';
            assert(
                label === EXPECTED_LABEL,
                `Search DCI label was "${label}"; was expecting ${EXPECTED_LABEL}`
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
                `Search DCI label was "${label}"; was expecting ${EXPECTED_LABEL}`
            );
        } );
    } );
} );
