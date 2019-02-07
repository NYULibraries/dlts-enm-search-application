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
} );
