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

// suite( 'Preview Pane', function () {
//     suiteSetup( function () {
//         try {
//             rimraf.sync( ACTUAL_FILES_DIRECTORY + '/*' );
//         } catch( error ) {
//             console.error( `ERROR clearing ${ACTUAL_FILES_DIRECTORY}: ${error}` );
//
//             process.exit( 1 );
//         }
//     } );
//
//     setup( function () {
//         SearchPage.open();
//     } );
//
//     goldenFiles.forEach( ( goldenFile ) => {
//         let golden = require( goldenFile );
//
//         testPreviewPane( golden );
//     } );
// } );
//
// function testPreviewPane( golden ) {
//     let query          = golden.query;
//     let pageNumber     = golden.pageNumber;
//     let searchFulltext = golden.searchFulltext;
//     let searchTopics   = golden.searchTopics;
//     let title          = golden.title;
//
//     let testTitle = `Preview pane for'${query}' `                                  +
//                     ( searchFulltext ? 'fulltext=TRUE ' : 'fulltext=FALSE ' ) +
//                     ( searchTopics   ? 'topics=TRUE '   : 'topics=FALSE '   ) +
//                     ' title=' + title + ' pageNumber=' + pageNumber +
//                     ' produces correct bar chart, title, page number,' +
//                     ' pageText with highlights, and topicsOnThisPage with highlights';
//
//     test( testTitle, function () {
//         if ( ! searchFulltext ) {
//             SearchPage.searchForm.fulltextCheckbox.click();
//         }
//
//         if ( ! searchTopics ) {
//             SearchPage.searchForm.topicsCheckbox.click();
//         }
//
//         SearchPage.searchAndWaitForResults( query );
//
//         SearchPage.resultsPane.results.book[ title ].click();
//         SearchPage.previewPane.barChart.barForPageNumber( pageNumber ).click();
//
//         let snapshot = SearchPage.previewSnapshot();
//         let previewId = SearchPage.getPreviewIdForCurrentPreview();
//
//         let stringifiedGolden = jsonStableStringify( golden );
//         let stringifiedSnapshot = jsonStableStringify( snapshot );
//
//         let goldenFile = GOLDEN_FILES_DIRECTORY + '/' + previewId + '.json';
//         let actualFile = ACTUAL_FILES_DIRECTORY + '/' + previewId + '.json';
//
//         if ( updateGoldenFiles ) {
//             fs.writeFileSync( goldenFile, stringifiedSnapshot );
//
//             console.log( `Updated golden file ${goldenFile}` );
//
//             return;
//         }
//
//         fs.writeFileSync( actualFile, stringifiedSnapshot );
//
//         assert(
//             stringifiedSnapshot === stringifiedGolden,
//             // eslint-disable-next-line indent
//             `Actual search results do not match expected.  Diff actual file vs  golden file for details:
//
//     diff ${goldenFile} ${actualFile}`
//         );
//     } );
// }

suite( 'Generate golden files', function () {
    setup( function () {
        SearchPage.open();
    } );

    require( GOLDEN_FILES_DIRECTORY + '/generate-initial-golden-files.json' ).forEach(
        ( preview ) => {
            generateGoldenFile( preview );
        }
    );
} );


function generateGoldenFile( preview ) {
    test( 'Generate new golden file for ' + JSON.stringify( preview, null, '    ' ), function () {
        if ( ! preview.searchFulltext ) {
            SearchPage.searchForm.fulltextCheckbox.click();
        }

        if ( ! preview.searchTopics ) {
            SearchPage.searchForm.topicsCheckbox.click();
        }

        SearchPage.searchAndWaitForResults( preview.query );
        SearchPage.resultsPane.results.book( preview.title ).click();
        SearchPage.previewPane.barChart.barForPageNumber( preview.pageNumber ).click();

        let snapshot  = SearchPage.previewSnapshot();
        let previewId = SearchPage.getPreviewIdForCurrentPreview();

        fs.writeFileSync(
            GOLDEN_FILES_DIRECTORY + '/' + previewId + '.json',
            jsonStableStringify( snapshot ) );
    } );
}
