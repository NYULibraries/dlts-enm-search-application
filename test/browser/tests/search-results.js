/* global setup:false suiteSetup:false suite:false test:false */

import { sync as commandExistsSync } from 'command-exists';
import { execSync } from 'child_process';
import fs from 'fs';
import rimraf from 'rimraf';
import path from 'path';

import { assert } from 'chai';

import SearchPage from '../pageobjects/search.page';

import { jsonStableStringify } from '../util';

const ACTUAL_FILES_DIRECTORY = path.resolve( __dirname, './testdata/actual/search-results/' );
const GOLDEN_FILES_DIRECTORY = path.resolve( __dirname, './testdata/golden/search-results/' );
const DIFF_FILES_DIRECTORY   = path.resolve( __dirname, '../diffs' );

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

const DIFF = 'diff';
const DIFF_EXISTS = commandExistsSync( DIFF );

suite( 'Search results', function () {
    suiteSetup( function () {
        try {
            rimraf.sync( ACTUAL_FILES_DIRECTORY + '/*' );
            rimraf.sync( DIFF_FILES_DIRECTORY + '/*' );
        } catch( error ) {
            console.error( `ERROR clearing directory: ${error}` );

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
                    ' topic-facet-values=[' + topicsDCIs + ']'                 +
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
        let message = 'Actual search results do not match expected.';
        if ( ! ok ) {
            if ( DIFF_EXISTS ) {
                // Create the diff file for later inspection
                const diffFile = `${DIFF_FILES_DIRECTORY}/${searchId}.txt`;
                const command = `diff ${goldenFile} ${actualFile} > ${diffFile}`;

                // Note that this will always throw an exception because `diff`
                // throws when files are different.
                try {
                    execSync( command );
                } catch( e ) {
                    if ( ! e.stderr.toString() ) {
                        // This is what is expected -- diff command succeeds.
                        message += `  See diff file: ${diffFile}`;
                    } else {
                        // This is unexpected -- diff command failed to create
                        // the diff file.
                        message += `  Diff command \`${command}\` failed:

${e.stderr.toString()}`;
                    }
                }
            } else {
                message += `  \`${DIFF}\` command not available.  Compare actual file vs golden file for details:
    ${goldenFile}
    ${actualFile}`;
            }
        }

        assert( ok, message );
    } );
}
