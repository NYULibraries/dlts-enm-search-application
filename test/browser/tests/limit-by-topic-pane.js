/* global setup:false suite:false test:false */

import _ from 'lodash';
import { assert } from 'chai';
import { EOL } from 'os';
import SearchPage from '../pageobjects/search.page';
import {
    getGoldenFilePath,
    SUITE_NAME,
} from '../util';

suite( 'Limit by Topic Pane', function () {
    setup( function () {
        SearchPage.open();
    } );

    test( 'Topics already selected will not appear in the Limit by Topic list', function () {
        SearchPage.searchAndWaitForResults( 'art' );

        const testTopic = SearchPage.limitByTopicPane.topicNames[ 0 ];

        SearchPage.limitByTopicAndWaitForResults( testTopic );

        const newLimitByTopicList = SearchPage.limitByTopicPane.topicNames;

        assert(
            newLimitByTopicList.includes( testTopic ) === false,
            `"${testTopic}" appears in new Limit by Topic after it has already been selected`
        );
    } );

    test( '"See all" link does not appear if there are no toggle-able topics', function () {
        SearchPage.searchAndWaitForResults( 'nerdfighter +"Helen Merrick (2009)"' );

        assert(
            SearchPage.limitByTopicPane.seeAllLink.isVisible() === false,
            '"See all" link is present even when there are no toggle-able topics'
        );
    } );

    test(
        'Clicking "See all" link produces correct full topics list',
        function () {
            SearchPage.searchAndWaitForResults( 'Dungeons & Dragons' );
            SearchPage.limitByTopicPane.seeAllLink.click();

            const expectedLimitByTopics = require(
                getGoldenFilePath( SUITE_NAME.limitByTopicPane, SearchPage.getSearchIdForCurrentSearch() )
            );
            const actualLimitByTopics = SearchPage.limitByTopicPane.topicNames;

            const inActualNotExpected = _.difference( actualLimitByTopics, expectedLimitByTopics );
            const inExpectedNotActual = _.difference( expectedLimitByTopics, actualLimitByTopics );

            const ok = ( inActualNotExpected.length === 0 && inExpectedNotActual.length === 0 );
            let message = '';
            if ( ! ok ) {
                if ( inActualNotExpected.length > 0 ) {
                    message += 'In actual not expected: ' +
                               JSON.stringify( inActualNotExpected, null, '   ' ) +
                               EOL;
                }

                if ( inExpectedNotActual.length > 0 ) {
                    message += 'In expected not actual: ' +
                               JSON.stringify( inExpectedNotActual, null, '   ' );
                }
            }

            assert( ok, message );
        }
    );

    test(
        'Clicking "See all" link causes "See all" link to disappear and "See less" to appear',
        function () {
            SearchPage.searchAndWaitForResults( 'Dungeons & Dragons' );
            SearchPage.limitByTopicPane.seeAllLink.click();

            assert(
                SearchPage.limitByTopicPane.seeAllLink.isVisible() === false &&
                SearchPage.limitByTopicPane.seeLessLink.isVisible() === true,
                seeAllSeeLessMode()
            );
        }
    );

    test(
        'Clicking "See less" link causes "See all" link to appear and "See less" to disappear',
        function () {
            SearchPage.searchAndWaitForResults( 'Dungeons & Dragons' );
            SearchPage.limitByTopicPane.seeAllLink.click();
            SearchPage.limitByTopicPane.seeLessLink.click();

            assert(
                SearchPage.limitByTopicPane.seeAllLink.isVisible() === true &&
                SearchPage.limitByTopicPane.seeLessLink.isVisible() === false,
                seeAllSeeLessMode()
            );
        }
    );
} );

function seeAllSeeLessMode() {
    let mode = '';

    if ( SearchPage.limitByTopicPane.seeAllLink.isVisible() ) {
        mode += '"See all" is visible and ';
    } else {
        mode += '"See all" is not visible and ';
    }

    if ( SearchPage.limitByTopicPane.seeLessLink.isVisible() ) {
        mode += '"See less" is visible.';
    } else {
        mode += '"See less" is not visible.';
    }

    return mode;
}
