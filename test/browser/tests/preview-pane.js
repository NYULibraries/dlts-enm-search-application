/* global setup:false suiteSetup:false suite:false test:false */

import fs from 'fs';
import rimraf from 'rimraf';
import path from 'path';

import { assert } from 'chai';

import SearchPage from '../pageobjects/search.page';

import { jsonStableStringify } from '../util';

const ACTUAL_FILES_DIRECTORY = path.resolve( __dirname, './testdata/actual/preview-pane/' );
const GOLDEN_FILES_DIRECTORY = path.resolve( __dirname, './testdata/golden/preview-pane/' );
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

suite( 'Preview Pane', function () {
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

    test( '"Load the first matched page" link', function () {
        SearchPage.searchAndWaitForResults( 'art' );
        SearchPage.previewPane.loadTheFirstMatchedPageLink.click();

        const expected = 'Japanese lessons|12';
        const got      = SearchPage.previewPane.title + '|' +
                         SearchPage.previewPane.pageNumber;

        assert(
            got === expected,
            'Clicking on "Load the first matched page" link did not load the correct preview.' +
            '  Expected: ' + expected + '; got: ' + got
        );
    } );

    test( '"Previous" button disabled for preview of first page hit', function () {
        SearchPage.searchAndWaitForResults( 'art' );
        SearchPage.resultsPane.results.book( 'Japanese lessons' ).click();
        SearchPage.previewPane.barChart.barForPageNumber( 12 ).click();

        // `isEnabled()` doesn't report correctly:
        //
        // > browser.getAttribute( 'a=< previous', 'disabled' )
        // 'true'
        // > browser.isEnabled( 'a=< previous' )
        // true
        // >
        assert(
            SearchPage.previewPane.previous.getAttribute( 'disabled' ) === 'true',
            '"Previous" button is not disabled for first page hit in bar chart'
        );
    } );

    test( '"Previous" button disabled for preview of first page hit', function () {
        SearchPage.searchAndWaitForResults( 'art' );
        SearchPage.resultsPane.results.book( 'Japanese lessons' ).click();
        SearchPage.previewPane.barChart.barForPageNumber( 262 ).click();

        // `isEnabled()` doesn't report correctly:
        //
        // > browser.getAttribute( 'a=next >', 'disabled' )
        // 'true'
        // > browser.isEnabled( 'a=next >' )
        // true
        // >
        assert(
            SearchPage.previewPane.next.getAttribute( 'disabled' ) === 'true',
            '"Next" button is not disabled for first page hit in bar chart'
        );
    } );

    goldenFiles.forEach( ( goldenFile ) => {
        testPreviewOfPage( goldenFile );
    } );
} );

function testPreviewOfPage( goldenFile ) {
    const golden = require( goldenFile );

    const query          = golden.query;
    const pageNumber     = golden.pageNumber;
    const searchFulltext = golden.searchFulltext;
    const searchTopics   = golden.searchTopics;
    const title          = golden.title;

    const testTitle = `Preview pane for'${query}' `                           +
                    ( searchFulltext ? 'fulltext=TRUE ' : 'fulltext=FALSE ' ) +
                    ( searchTopics   ? 'topics=TRUE '   : 'topics=FALSE '   ) +
                    ' title=' + title + ' pageNumber=' + pageNumber +
                    ' produces correct bar chart, title, page number,' +
                    ' pageText with highlights, and topicsOnThisPage with highlights';

    test( testTitle, function () {
        if ( ! searchFulltext ) {
            SearchPage.searchForm.fulltextCheckbox.click();
        }

        if ( ! searchTopics ) {
            SearchPage.searchForm.topicsCheckbox.click();
        }

        SearchPage.searchAndWaitForResults( query );

        SearchPage.resultsPane.results.book( title ).click();
        SearchPage.previewPane.barChart.barForPageNumber( pageNumber ).click();

        const result = compareActualToGolden();
        const actualFile = getActualFilePath( golden.id );

        assert(
            result,
            // eslint-disable-next-line indent
            `Actual search results do not match expected.  Diff actual file vs golden file for details:

    diff ${goldenFile} ${actualFile}`
        );
    } );
}

function compareActualToGolden() {
    const snapshot = SearchPage.previewSnapshot();
    const previewId = SearchPage.getPreviewIdForCurrentPreview();
    const goldenFile = getGoldenFilePath( previewId );
    const golden = require( goldenFile );

    const stringifiedGolden = jsonStableStringify( golden );
    const stringifiedSnapshot = jsonStableStringify( snapshot );

    const actualFile = getActualFilePath( previewId );

    if ( updateGoldenFiles ) {
        fs.writeFileSync( goldenFile, stringifiedSnapshot );

        console.log( `Updated golden file ${goldenFile}` );

        return;
    }

    fs.writeFileSync( actualFile, stringifiedSnapshot );

    return stringifiedSnapshot === stringifiedGolden;
}

function getActualFilePath( previewId ) {
    return ACTUAL_FILES_DIRECTORY + '/' + previewId + '.json';
}

function getGoldenFilePath( previewId ) {
    return GOLDEN_FILES_DIRECTORY + '/' + previewId + '.json';
}
