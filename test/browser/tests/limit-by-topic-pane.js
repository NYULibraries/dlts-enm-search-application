/* global setup:false suite:false test:false */

import { assert } from 'chai';

import SearchPage from '../pageobjects/search.page';

suite( 'Navbar', function () {
    setup( function () {
        SearchPage.open();
    } );

    test( 'Temp', function () {
        SearchPage.searchAndWaitForResults( 'art' );

        let topicsWithHitCounts = SearchPage.limitByTopicPane.topicsWithHitCounts;

        let topic = topicsWithHitCounts[ 0 ][ 0 ];

        SearchPage.limitByTopicPane.click( topic );
        SearchPage.limitByTopicPane.click( 'Andreas-Salomé, Lou (Luise)' );
        SearchPage.limitByTopicPane.click( 'Disintegration -- fear of' );

        console.log( SearchPage.searchEcho.searchDCI.query );
        console.log( SearchPage.searchEcho.topicDCIs.topics );

        SearchPage.searchEcho.topicDCIs.dismiss( topic );
        console.log( SearchPage.searchEcho.topicDCIs.topics );

        SearchPage.searchEcho.searchDCI.dismiss();

        console.log( SearchPage.searchEcho.topicDCIs.topics );

        console.log( topicsWithHitCounts );
    } );
} );
