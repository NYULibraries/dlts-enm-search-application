/* global setup:false suite:false test:false */

import fs from 'fs';
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
    setup( function () {
        SearchPage.open();
    } );

    goldenFiles.forEach( ( goldenFile ) => {
        let expectedSearchResults = require( goldenFile );

        Object.entries( expectedSearchResults ).forEach( ( entry ) => {
            let [ query, expectedResults ] = entry;

            testResults( query, expectedResults );

            testResultsPaneNumBooksAndPages( query, expectedResults );

            testResultsPaneHits( query, {} );
        } );
    } );
} );

function testResults( query , expectedResults ) {
    test( 'Query "' + query + '" should return correct hits', function () {
        SearchPage.searchAndWaitForResults( query );

        let snapshot = SearchPage.searchResultsSnapshot();
        let queryId  = SearchPage.getQueryIdForCurrentQuery();

        if ( updateGoldenFiles ) {
            fs.writeFileSync(
                'testdata/search-results/' + queryId + '.json',
                JSON.stringify( snapshot, null, '   ' ) );
        }
    } );
}

function testResultsPaneNumBooksAndPages( query, expected ) {
    test( 'Query "' + query + '" should return correct number of books and pages', function () {
        SearchPage.searchAndWaitForResults( query );

        function getStringForComparison( numPages, numBooks ) {
            return numBooks + ' books | ' + numPages + ' pages';
        }

        assert.equal(
            getStringForComparison( SearchPage.resultsPane.header.numPages(), SearchPage.resultsPane.header.numBooks() ),
            getStringForComparison( expected.resultsPane.numPages, expected.resultsPane.numBooks )
        );
    } );
}

function testResultsPaneHits( query, expected ) {
    test( 'Query "' + query + '" should return correct hits', function () {
        SearchPage.searchAndWaitForResults( query );

        let books = SearchPage.resultsPane.results.metadata();

        console.log( books );
    } );
}
