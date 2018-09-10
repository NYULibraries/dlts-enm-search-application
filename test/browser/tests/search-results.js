/* global setup:false suite:false test:false */

import fs from 'fs';

import { assert } from 'chai';

import SearchPage from '../pageobjects/search.page';

const goldenFiles = fs.readdirSync( './testdata/golden/search-results/' );

suite( 'Search results', function () {
    setup( function () {
        SearchPage.open();
    } );

    goldenFiles.forEach( ( goldenFile ) => {
        let expectedSearchResults = require( goldenFile );

        Object.entries( expectedSearchResults ).forEach( ( entry ) => {
            let [ query, expectedResults ] = entry;

            testResultsPaneNumBooksAndPages( query, expectedResults );
        } );
    } );
} );

function testResultsPaneNumBooksAndPages( query, expected ) {
    test( 'Query "' + query + '" should return correct number of books and pages', function () {
        SearchPage.searchAndWaitForResults( query );

        function getStringForComparison( numPages, numBooks ) {
            return numBooks + ' books | ' + numPages + ' pages';
        }

        assert.equal(
            getStringForComparison( SearchPage.getResultsPaneNumPages(), SearchPage.getResultsPaneNumBooks() ),
            getStringForComparison( expected.resultsPane.numPages, expected.resultsPane.numBooks )
        );
    } );
}
