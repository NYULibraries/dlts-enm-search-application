/* global setup:false suiteSetup:false suite:false test:false */

import { assert } from 'chai';

import SearchPage from '../pageobjects/search.page';

suite( 'Solr errors', function () {
    test( 'User-friendly error message when Solr request for search fails', function () {
        SearchPage.open(
            {
                solrErrorSimulation : 'search',
            }
        );

        SearchPage.search( 'anything' );

        assert.equal(
            SearchPage.resultsPane.header.text,
            'Sorry, a server error has occurred. Please try your search again later.'
        );
    } );

    test( 'User-friendly error message when Solr request for preview epub fails', function () {
        SearchPage.open(
            {
                solrErrorSimulation : 'preview-epub',
            }
        );

        SearchPage.searchAndWaitForResults( 'art' );
        SearchPage.resultsPane.results.book( 'Japanese lessons' ).click();

        assert.equal(
            SearchPage.previewPane.previewEpubErrorText,
            'Sorry, this book cannot be previewed due to a server error. Please try your search again later.'
        );
    } );

    test( 'User-friendly error message when Solr request for preview epub page fails', function () {
        SearchPage.open(
            {
                solrErrorSimulation : 'preview-page',
            }
        );

        SearchPage.searchAndWaitForResults( 'art' );
        SearchPage.resultsPane.results.book( 'Japanese lessons' ).click();
        SearchPage.previewPane.barChart.clickBarForPageNumber( 12 );

        assert.equal(
            SearchPage.previewPane.previewPageErrorText,
            'Sorry, these pages cannot be previewed due to a server error. Please try your search again later.'
        );
    } );
} );
