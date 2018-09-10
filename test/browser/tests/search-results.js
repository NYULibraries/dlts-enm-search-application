/* global setup:false suite:false test:false */

import { assert } from 'chai';

import SearchPage from '../pageobjects/search.page';

const expectedSearchResults = require( './testdata/golden/search-results/temp.json' );

suite( 'Search results', function () {
    setup( function () {
        SearchPage.open();
    } );

    Object.entries( expectedSearchResults ).forEach( ( entry ) => {
        let [ query, expectedResults ] = entry;

        testResultsPaneNumBooksAndPages( query, expectedResults );
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
