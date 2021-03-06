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
    isDisabled,
    jsonStableStringify,
    updateGoldenFiles,
    SUITE_NAME,
} from '../util';

const goldenFiles = getGoldenFiles( SUITE_NAME.previewPane );

suite( 'Preview Pane', function () {
    suiteSetup( function () {
        clearActualFilesDirectory( SUITE_NAME.previewPane );
        clearDiffFilesDirectory( SUITE_NAME.previewPane );
    } );

    setup( function () {
        SearchPage.open();
        // Setting to wider width helps prevent errors with not being able
        // to click rightmost bar in bar chart.
        // Was keeping it at the exact threshold for a while, which recently changed
        // from 1600 to 1601 in Firefox!...so instead let's just set it much higher
        // than we need.
        SearchPage.setWindowSize(
            {
                height : 851,
                width  : 1700,
            }
        );
    } );

    test( '"Load the first matched page" link', function () {
        SearchPage.searchAndWaitForResults( 'art' );
        SearchPage.previewPane.loadTheFirstMatchedPageLink.click();

        const previewId = SearchPage.getPreviewId( 'art', true, true, [], 9780814712917, 12 );
        const goldenFile = getGoldenFilePath( SUITE_NAME.previewPane, previewId );
        const ok = compareActualToGolden( goldenFile );
        let message;
        if ( ! ok ) {
            message = diffActualVsGoldenAndReturnMessage(
                SUITE_NAME.previewPane,
                getActualFilePath( SUITE_NAME.previewPane, previewId ),
                goldenFile,
                previewId
            );
        }

        assert( ok, `"Load the first matched page" link failed. ` + message );
    } );

    test( '"Previous" button disabled for preview of first page hit', function () {
        SearchPage.searchAndWaitForResults( 'art' );
        SearchPage.resultsPane.results.book( 'Japanese lessons' ).click();
        SearchPage.previewPane.barChart.clickBarForPageNumber( 12 );

        // `isEnabled()` doesn't report correctly:
        //
        // > browser.getAttribute( 'a=< previous', 'disabled' )
        // 'true'
        // > browser.isEnabled( 'a=< previous' )
        // true
        // >
        assert(
            isDisabled( SearchPage.previewPane.previous ),
            '"Previous" button is not disabled for first page hit in bar chart'
        );
    } );

    test( '"Next" button disabled for preview of last page hit', function () {
        SearchPage.searchAndWaitForResults( 'art' );
        SearchPage.resultsPane.results.book( 'Japanese lessons' ).click();
        SearchPage.previewPane.barChart.clickBarForPageNumber( 262 );

        // `isEnabled()` doesn't report correctly:
        //
        // > browser.getAttribute( 'a=next >', 'disabled' )
        // 'true'
        // > browser.isEnabled( 'a=next >' )
        // true
        // >
        assert(
            isDisabled( SearchPage.previewPane.next ),
            '"Next" button is not disabled for first page hit in bar chart'
        );
    } );

    test( '"Previous" button brings up correct preview for previous page', function () {
        SearchPage.searchAndWaitForResults( 'art' );
        SearchPage.resultsPane.results.book( 'Japanese lessons' ).click();
        SearchPage.previewPane.barChart.clickBarForPageNumber( 154 );
        SearchPage.previewPane.previous.click();

        const previewId = SearchPage.getPreviewId( 'art', true, true, [], 9780814712917, 153 );
        const goldenFile = getGoldenFilePath( SUITE_NAME.previewPane, previewId );
        const ok = compareActualToGolden( goldenFile );
        let message;
        if ( ! ok ) {
            message = diffActualVsGoldenAndReturnMessage(
                SUITE_NAME.previewPane,
                getActualFilePath( SUITE_NAME.previewPane, previewId ),
                goldenFile,
                previewId,
            );
        }

        assert( ok, `Clicking "Previous" button did not bring up correct preview. ` + message );
    } );

    test( '"Next" button brings up correct preview for next page', function () {
        SearchPage.searchAndWaitForResults( 'art' );
        SearchPage.resultsPane.results.book( 'Japanese lessons' ).click();
        SearchPage.previewPane.barChart.clickBarForPageNumber( 145 );
        SearchPage.previewPane.next.click();

        const previewId = SearchPage.getPreviewId( 'art', true, true, [], 9780814712917, 153 );
        const goldenFile = getGoldenFilePath( SUITE_NAME.previewPane, previewId );
        const ok = compareActualToGolden( goldenFile );
        let message;
        if ( ! ok ) {
            message = diffActualVsGoldenAndReturnMessage(
                SUITE_NAME.previewPane,
                getActualFilePath( SUITE_NAME.previewPane, previewId ),
                goldenFile,
                previewId,
            );
        }

        assert( ok, `Clicking "Next" button did not bring up correct preview. ` + message );
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

    const testTitle = `Preview pane for'${ query }' `                         +
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
        SearchPage.previewPane.barChart.clickBarForPageNumber( pageNumber );

        const ok = compareActualToGolden( goldenFile );
        let message;
        if ( ! ok ) {
            message = diffActualVsGoldenAndReturnMessage(
                SUITE_NAME.previewPane,
                getActualFilePath( SUITE_NAME.previewPane, golden.id ),
                goldenFile,
                golden.id,
            );
        }

        assert( ok, `Preview of page ${ pageNumber } of _${ title }_ failed. ` + message );
    } );
}

function compareActualToGolden( goldenFile ) {
    const snapshot = SearchPage.previewSnapshot();
    const previewId = SearchPage.getPreviewIdForCurrentPreview();
    const golden = require( goldenFile );

    const stringifiedGolden = jsonStableStringify( golden );
    const stringifiedSnapshot = jsonStableStringify( snapshot );

    const actualFile = getActualFilePath( SUITE_NAME.previewPane, previewId );

    if ( updateGoldenFiles() ) {
        fs.writeFileSync( goldenFile, stringifiedSnapshot );

        console.log( `Updated golden file ${ goldenFile }` );

        return true;
    }

    fs.writeFileSync( actualFile, stringifiedSnapshot );

    return stringifiedSnapshot === stringifiedGolden;
}
