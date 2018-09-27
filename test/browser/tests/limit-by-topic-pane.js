/* global setup:false suite:false test:false */

import { assert } from 'chai';

import SearchPage from '../pageobjects/search.page';

suite( 'Limit by Topic Pane', function () {
    setup( function () {
        SearchPage.open();
    } );

    test( 'Topics already selected will not appear in the Limit by Topic list', function () {
        SearchPage.searchAndWaitForResults( 'art' );

        const testTopic = SearchPage.limitByTopicPane.topicNames[ 0 ];

        SearchPage.limitByTopicPane.topic( testTopic ).click();

        const newLimitByTopicList = SearchPage.limitByTopicPane.topicNames;

        assert(
            newLimitByTopicList.includes( testTopic ) === false,
            `"${testTopic}" appears in new Limit by Topic after it has already been selected`
        );
    } );
} );
