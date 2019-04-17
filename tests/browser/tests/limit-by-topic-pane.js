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
            `"${ testTopic }" appears in new Limit by Topic after it has already been selected`
        );
    } );

    test( '"See all" link does not appear if there are no togglable topics', function () {
        SearchPage.searchAndWaitForResults( 'nerdfighter +"Helen Merrick (2009)"' );

        assert(
            SearchPage.limitByTopicPane.seeAllLink.isDisplayed() === false,
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
                SearchPage.limitByTopicPane.seeAllLink.isDisplayed() === false &&
                SearchPage.limitByTopicPane.seeLessLink.isDisplayed() === true,
                seeAllSeeLessMode()
            );
        }
    );

    test(
        'Clicking "See less" link produces correct short list',
        function () {
            SearchPage.searchAndWaitForResults( 'Dungeons & Dragons' );

            const initialShortList = SearchPage.limitByTopicPane.topicNames;

            SearchPage.limitByTopicPane.seeAllLink.click();

            assert(
                SearchPage.limitByTopicPane.topicNames.length > initialShortList.length,
                'Clicking "See all" link did not expand the list.  Can\'t continue with the test...'
            );

            SearchPage.limitByTopicPane.seeLessLink.click();

            const actualLimitByTopicsAfterSeeLess = SearchPage.limitByTopicPane.topicNames;

            const inActualNotExpected = _.difference( actualLimitByTopicsAfterSeeLess, initialShortList );
            const inExpectedNotActual = _.difference( initialShortList, actualLimitByTopicsAfterSeeLess );

            const ok = ( inActualNotExpected.length === 0 && inExpectedNotActual.length === 0 );
            let message = '';
            if ( ! ok ) {
                message = 'Clicking "See less" link did not restore original short list.  ' + EOL;

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
        'Clicking "See less" link causes "See all" link to appear and "See less" to disappear',
        function () {
            SearchPage.searchAndWaitForResults( 'Dungeons & Dragons' );
            SearchPage.limitByTopicPane.seeAllLink.click();
            SearchPage.limitByTopicPane.seeLessLink.click();

            assert(
                SearchPage.limitByTopicPane.seeAllLink.isDisplayed() === true &&
                SearchPage.limitByTopicPane.seeLessLink.isDisplayed() === false,
                seeAllSeeLessMode()
            );
        }
    );
} );

function seeAllSeeLessMode() {
    let mode = '';

    if ( SearchPage.limitByTopicPane.seeAllLink.isDisplayed() ) {
        mode += '"See all" is visible and ';
    } else {
        mode += '"See all" is not visible and ';
    }

    if ( SearchPage.limitByTopicPane.seeLessLink.isDisplayed() ) {
        mode += '"See less" is visible.';
    } else {
        mode += '"See less" is not visible.';
    }

    return mode;
}
