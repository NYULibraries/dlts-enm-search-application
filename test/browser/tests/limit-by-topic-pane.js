/* global setup:false suite:false test:false */

import { assert } from 'chai';

import SearchPage from '../pageobjects/search.page';

suite( 'Limit by Topic Pane', function () {
    setup( function () {
        SearchPage.open();
    } );

    test( 'Temp', function () {
        SearchPage.searchAndWaitForResults( 'art' );

        let topicsWithHitCounts = SearchPage.limitByTopicPane.topicsWithHitCounts;

        let topic = topicsWithHitCounts[ 0 ][ 0 ];

        SearchPage.limitByTopicPane.clickTopic( topic );
        SearchPage.limitByTopicPane.clickTopic( 'Andreas-Salomé, Lou (Luise)' );
        SearchPage.limitByTopicPane.clickTopic( 'Disintegration -- fear of' );

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
