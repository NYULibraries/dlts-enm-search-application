/* global setup:false suite:false suiteSetup:false test:false */

import { assert } from 'chai';
import { EOL } from 'os';
import fs from 'fs';
import SearchPage from '../pageobjects/search.page';
import {
    clearActualFilesDirectory, clearDiffFilesDirectory,
    diffActualVsGoldenAndReturnMessage,
    getActualFilePath,
    getGoldenFilePath,
    jsonStableStringify,
    SUITE_NAME,
} from '../util';

suite( 'Search Echo', function () {
    suiteSetup( function () {
        clearActualFilesDirectory( SUITE_NAME.searchEcho );
        clearDiffFilesDirectory( SUITE_NAME.searchEcho );
    } );

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

            SearchPage.dismissSearchDCIAndWaitForResults();

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

        test( 'If query is already "*", do not reset preview', function () {
            SearchPage.searchAndWaitForResults( 'art' );
            SearchPage.resultsPane.results.book( 'Japanese lessons' ).click();

            const expectedPage = getCurrentPreviewPanePage(
                'Japanese lessons', '12'
            );
            let currentPage = getCurrentPreviewPanePage(
                SearchPage.previewPane.title, SearchPage.previewPane.pageNumber
            );
            if ( currentPage !== expectedPage ) {
                assert.fail(
                    0, 1, 'Setup of test failed: preview pane has page ' +
                          currentPage + ' loaded; expected ' + expectedPage
                );
            }

            SearchPage.dismissSearchDCIAndWaitForResults();

            if ( SearchPage.resultsPane.header.text === 'Results: None' ) {
                assert.fail( 0, 1, 'Search was reset instead of left alone at "*"' );
            }

            currentPage = getCurrentPreviewPanePage(
                SearchPage.previewPane.title, SearchPage.previewPane.pageNumber
            );
            assert(
                currentPage,
                'Preview Pane does not have the same page loaded as it did before search DCI dismissal; ' +
                'got ' + currentPage + '; expected ' + expectedPage
            );
        } );

        test( 'Change to "*" if topic DCIs', function () {
            SearchPage.searchAndWaitForResults( 'art' );
            SearchPage.limitByTopicAndWaitForResults( 'postmodernism' );

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

    suite( 'Topic DCI dismissal', function () {
        setup( function () {
            SearchPage.open();
        } );

        test( 'Dismissing topic DCI produces correct search results', function () {
            SearchPage.searchAndWaitForResults( 'art' );
            SearchPage.limitByTopicAndWaitForResults( 'Rilke\'s writings -- Notebooks of Malte Laurids Brigge, The (Die Aufzeichnungnen des Malte Laurids Brigge)' );

            const dismissedTopic = 'Rilke\'s writings -- "Modern Poetry" ("Moderne Lyrik")';
            SearchPage.limitByTopicAndWaitForResults( dismissedTopic );

            const resultTestSetup = compareActualToGolden();
            if ( ! resultTestSetup.ok ) {
                const message = 'Setup of test failed.  ' + resultTestSetup.message;

                assert.fail( 0, 1, message );
            }

            const dismissedTopicEscapedDoubleQuotes = dismissedTopic.replace( /"/g, '\\"' );
            SearchPage.searchEcho.topicDCIs.dismiss( dismissedTopicEscapedDoubleQuotes );

            const result = compareActualToGolden();

            assert( result.ok, `Dismissal of ${dismissedTopic} resulted in incorrect search: ${result.message}` );
        } );

        test( 'Dismissing topic DCI resets Preview Pane', function () {
            const topic = 'modernism';

            SearchPage.searchAndWaitForResults( 'art' );
            SearchPage.limitByTopicAndWaitForResults( topic );
            SearchPage.resultsPane.results.book( 'Split Screen Korea' ).click();

            if ( SearchPage.previewPane.title !== 'Split Screen Korea' ) {
                assert.fail( 0, 1, 'Setup of test failed.  _Split Screen Korea_ is not loaded in Preview Pane' );
            }

            SearchPage.dismissTopicDCIAndWaitForResults( topic );

            assert(
                SearchPage.previewPane.loadTheFirstMatchedPageLink.isVisible(),
                '"Load the first matched page" link is not visible'
            );
        } );
    } );
} );

function getCurrentPreviewPanePage( title, pageNumber ) {
    return `${title}|${pageNumber}`;
}

function getSearchFailureMessage( snapshot ) {
    const searchId       = snapshot.id;
    const query          = snapshot.query;
    const searchFulltext = snapshot.searchFulltext;
    const searchTopics   = snapshot.searchTopics;
    const topicsDCIs     = snapshot.topicsDCIs;

    const diffMessage = diffActualVsGoldenAndReturnMessage(
        SUITE_NAME.searchEcho,
        getActualFilePath( SUITE_NAME.searchEcho, searchId ),
        getGoldenFilePath( SUITE_NAME.searchResults, searchId ),
        searchId
    );

    return `Search for '${query}' `                                +
        ( searchFulltext ? 'fulltext=TRUE ' : 'fulltext=FALSE ' )  +
        ( searchTopics   ? 'topics=TRUE '   : 'topics=FALSE '   )  +
        ' topic-facet-values=[' + topicsDCIs + ']'                 +
        ' produces correct DCIs, Limit by Topic list, '            +
        ' search results header, EPUBs list with thumbnails and'   +
        ' metadata did not produce correct snapshot. ' + EOL +
        diffMessage;
}

function compareActualToGolden() {
    const snapshot = SearchPage.searchResultsSnapshot();

    const searchId = snapshot.id;

    const golden = require( getGoldenFilePath( SUITE_NAME.searchResults, searchId ) );

    const stringifiedGolden = jsonStableStringify( golden );
    const stringifiedSnapshot = jsonStableStringify( snapshot );

    const ok = ( stringifiedSnapshot === stringifiedGolden );

    if ( ! ok ) {
        fs.writeFileSync(
            getActualFilePath( SUITE_NAME.searchEcho, searchId ),
            stringifiedSnapshot
        );
    }

    let message = ok || getSearchFailureMessage( snapshot );

    return { ok, message };
}
