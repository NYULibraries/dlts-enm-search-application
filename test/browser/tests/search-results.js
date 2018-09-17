/* global setup:false suiteSetup:false suite:false test:false */

import fs from 'fs';
import rimraf from 'rimraf';
import path from 'path';

import { assert } from 'chai';

import SearchPage from '../pageobjects/search.page';

import { jsonStableStringify } from '../util';

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
            console.error( `ERROR clearing ${ACTUAL_FILES_DIRECTORY}: ${error}` );

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
    let query          = golden.query;
    let searchFulltext = golden.searchFulltext;
    let searchTopics   = golden.searchTopics;

    let testTitle = `Search for '${query}' `                                  +
                    ( searchFulltext ? 'fulltext=TRUE ' : 'fulltext=FALSE ' ) +
                    ( searchTopics   ? 'topics=TRUE '   : 'topics=FALSE '   ) +
                    ' works correctly';

    test( testTitle, function () {
        if ( ! searchFulltext ) {
            SearchPage.searchForm.fulltextCheckbox.click();
        }

        if ( ! searchTopics ) {
            SearchPage.searchForm.topicsCheckbox.click();
        }

        SearchPage.searchAndWaitForResults( query );

        let snapshot = SearchPage.searchResultsSnapshot();
        let searchId = SearchPage.getSearchIdForCurrentSearch();

        let stringifiedGolden = jsonStableStringify( golden );
        let stringifiedSnapshot = jsonStableStringify( snapshot );

        let goldenFile = GOLDEN_FILES_DIRECTORY + '/' + searchId + '.json';
        let actualFile = ACTUAL_FILES_DIRECTORY + '/' + searchId + '.json';

        if ( updateGoldenFiles ) {
            fs.writeFileSync( goldenFile, stringifiedSnapshot );

            console.log( `Updated golden file ${goldenFile}` );

            return;
        }

        fs.writeFileSync( actualFile, stringifiedSnapshot );

        assert(
            stringifiedSnapshot === stringifiedGolden,
            // eslint-disable-next-line indent
`Actual search results do not match expected.  Diff actual file vs  golden file for details:

    diff ${goldenFile} ${actualFile}`
        );
    } );
}
