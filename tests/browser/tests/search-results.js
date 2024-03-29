/* global setup:false suiteSetup:false suite:false test:false */

import fs from 'fs';

import { assert } from 'chai';

import SearchPage from '../pageobjects/search.page';

import {
    clearActualFilesDirectory,
    clearDiffFilesDirectory,
    diffActualVsGoldenAndReturnMessage,
    getActualFilePath,
    getGoldenFilePath,
    getGoldenFiles,
    jsonStableStringify,
    updateGoldenFiles,
    SUITE_NAME,
} from '../util';

const goldenFiles = getGoldenFiles( SUITE_NAME.searchResults );

suite( 'Search results', function () {
    suiteSetup( function () {
        clearActualFilesDirectory( SUITE_NAME.searchResults );
        clearDiffFilesDirectory( SUITE_NAME.searchResults );
    } );

    setup( function () {
        SearchPage.open();
        // Setting to wider width prevents a problem in Firefox where that is brought
        // into the screen by a scroll is not clickable due to a horizontal
        // scrollbar obscuring it.  This bug occurs when query is "time", and
        // a topic that is not immediately visible is selected by first clicking
        // "See all" link.
        // Width of 1500 was found to be sufficient, but 1600 is used in Preview Pane
        // tests so using that higher width for consistency.
        SearchPage.setWindowSize(
            {
                height : 851,
                width  : 1600,
            }
        );
    } );

    goldenFiles.forEach( ( goldenFile ) => {
        let golden = require( goldenFile );

        testSearchResults( golden );
    } );
} );

function testSearchResults( golden ) {
    const topicsDCIs     = golden.topicsDCIs;
    const query          = golden.query;
    const searchFulltext = golden.searchFulltext;
    const searchTopics   = golden.searchTopics;

    const testTitle = `Search for '${ query }' `                              +
                    ( searchFulltext ? 'fulltext=TRUE ' : 'fulltext=FALSE ' ) +
                    ( searchTopics   ? 'topics=TRUE '   : 'topics=FALSE '   ) +
                    ' topic-facet-values=[' + topicsDCIs + ']'                +
                    ' produces correct DCIs, Limit by Topic list, '           +
                    ' search results header, EPUBs list with thumbnails and'  +
                    ' metadata';

    test( testTitle, function () {
        if ( ! searchFulltext ) {
            SearchPage.searchForm.fulltextCheckbox.click();
        }

        if ( ! searchTopics ) {
            SearchPage.searchForm.topicsCheckbox.click();
        }

        SearchPage.searchAndWaitForResults( query );

        if ( topicsDCIs.length > 0 ) {
            topicsDCIs.forEach( ( topic ) => {
                SearchPage.limitByTopicAndWaitForResults( topic );
            } );
        }

        const snapshot = SearchPage.searchResultsSnapshot();
        const searchId = SearchPage.getSearchIdForCurrentSearch();

        const stringifiedGolden = jsonStableStringify( golden );
        const stringifiedSnapshot = jsonStableStringify( snapshot );

        const actualFile = getActualFilePath( SUITE_NAME.searchResults, searchId );
        const goldenFile = getGoldenFilePath( SUITE_NAME.searchResults, searchId );

        if ( updateGoldenFiles() ) {
            fs.writeFileSync( goldenFile, stringifiedSnapshot );

            console.log( `Updated golden file ${ goldenFile }` );

            return;
        }

        fs.writeFileSync( actualFile, stringifiedSnapshot );

        const ok = ( stringifiedSnapshot === stringifiedGolden );
        let message;
        if ( ! ok ) {
            message = diffActualVsGoldenAndReturnMessage( SUITE_NAME.searchResults, actualFile, goldenFile, searchId );
        }

        assert( ok, message );
    } );
}
