/* global setup:false suite:false test:false */

import { assert } from 'chai';

import SearchPage from '../pageobjects/search.page';

suite( 'Limit by Topic Pane', function () {
    setup( function () {
        SearchPage.open();
    } );

    test( 'Temp', function () {
        SearchPage.searchAndWaitForResults( 'art' );

        let topicsWithHitCounts = SearchPage.limitByTopicPane.topicNamesWithHitCounts;

        let topic = topicsWithHitCounts[ 0 ][ 0 ];

        SearchPage.limitByTopicPane.topic( topic ).click();
        SearchPage.limitByTopicPane.topic( 'Andreas-Salomé, Lou (Luise)' ).click();
        SearchPage.limitByTopicPane.topic( 'Disintegration -- fear of' ).click();

        console.log( SearchPage.searchEcho.searchDCI.query );
        console.log( SearchPage.searchEcho.topicDCIs.topics );

        SearchPage.searchEcho.topicDCIs.dismiss( topic );
        console.log( SearchPage.searchEcho.topicDCIs.topics );

        SearchPage.searchEcho.topicDCIs.dismiss( 'Disintegration -- fear of' );
        console.log( SearchPage.searchEcho.topicDCIs.topics );

        SearchPage.searchEcho.searchDCI.dismiss();

        SearchPage.limitByTopicPane.seeAllLink.click();
        SearchPage.limitByTopicPane.seeLessLink.waitForVisible();
        SearchPage.limitByTopicPane.seeLessLink.click();

        console.log( topicsWithHitCounts );
    } );
} );
