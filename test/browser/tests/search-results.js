/* global setup:false suiteSetup:false suite:false test:false */

import fs from 'fs';
import rimraf from 'rimraf';
import path from 'path';

import { assert } from 'chai';

import SearchPage from '../pageobjects/search.page';

import {
    clearDiffFilesDirectory,
    diffActualVsGoldenAndReturnMessage,
    jsonStableStringify,
} from '../util';

const ACTUAL_FILES_DIRECTORY = path.resolve( __dirname, './testdata/actual/search-results/' );
const GOLDEN_FILES_DIRECTORY = path.resolve( __dirname, './testdata/golden/search-results/' );

const goldenFiles = fs.readdirSync( GOLDEN_FILES_DIRECTORY ).map( ( file ) => {
    return path.resolve( GOLDEN_FILES_DIRECTORY + '/' + file );
} );

let updateGoldenFiles = false;

if (
    process.env.UPDATE_GOLDEN_FILES &&
    process.env.UPDATE_GOLDEN_FILES.toLowerCase() !== 'false'
) {
    updateGoldenFiles = true;
}

suite( 'Search results', function () {
    suiteSetup( function () {
        try {
            rimraf.sync( ACTUAL_FILES_DIRECTORY + '/*' );
        } catch( error ) {
            console.error( `ERROR clearing directory: ${error}` );

            process.exit( 1 );
        }

        try {
            clearDiffFilesDirectory();
        } catch( error ) {
            console.error( `ERROR clearing diff files directory: ${error}` );

            process.exit( 1 );
        }
    } );

    setup( function () {
        SearchPage.open();
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

    const testTitle = `Search for '${query}' `                                +
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

        const goldenFile = GOLDEN_FILES_DIRECTORY + '/' + searchId + '.json';
        const actualFile = ACTUAL_FILES_DIRECTORY + '/' + searchId + '.json';

        if ( updateGoldenFiles ) {
            fs.writeFileSync( goldenFile, stringifiedSnapshot );

            console.log( `Updated golden file ${goldenFile}` );

            return;
        }

        fs.writeFileSync( actualFile, stringifiedSnapshot );

        const ok = ( stringifiedSnapshot === stringifiedGolden );
        let message;
        if ( ! ok ) {
            message = diffActualVsGoldenAndReturnMessage( actualFile, goldenFile, searchId );
        }

        assert( ok, message );
    } );
}
