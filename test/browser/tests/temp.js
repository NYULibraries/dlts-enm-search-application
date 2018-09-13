/* global browser:false setup:false suite:false test:false */

import { assert } from 'chai';

import SearchPage from '../pageobjects/search.page';

suite( 'Temp', function () {
    setup( function () {
        SearchPage.open();
    } );

    // test( 'limit by topic', function () {
    //     SearchPage.searchAndWaitForResults( 'art' );
    //
    //     let topicsWithHitCounts = SearchPage.limitByTopicPane.topicNamesWithHitCounts;
    //
    //     let topic = topicsWithHitCounts[ 0 ][ 0 ];
    //
    //     SearchPage.limitByTopicPane.topic( topic ).click();
    //     SearchPage.limitByTopicPane.topic( 'Andreas-Salomé, Lou (Luise)' ).click();
    //     SearchPage.limitByTopicPane.topic( 'Disintegration -- fear of' ).click();
    //
    //     console.log( SearchPage.searchEcho.searchDCI.query );
    //     console.log( SearchPage.searchEcho.topicDCIs.topics );
    //
    //     SearchPage.searchEcho.topicDCIs.dismiss( topic );
    //     console.log( SearchPage.searchEcho.topicDCIs.topics );
    //
    //     SearchPage.searchEcho.topicDCIs.dismiss( 'Disintegration -- fear of' );
    //     console.log( SearchPage.searchEcho.topicDCIs.topics );
    //
    //     SearchPage.searchEcho.searchDCI.dismiss();
    //
    //     SearchPage.limitByTopicPane.seeAllLink.click();
    //     SearchPage.limitByTopicPane.seeLessLink.waitForVisible();
    //     SearchPage.limitByTopicPane.seeLessLink.click();
    //
    //     console.log( topicsWithHitCounts );
    // } );

    test( 'preview pane', function () {
        // SearchPage.searchForm.fulltextCheckbox.click();
        SearchPage.searchAndWaitForResults( 'art' );

        SearchPage.previewPane.loadTheFirstMatchedPageLink.click();

        // SearchPage.previewPane.next.click();
        // SearchPage.previewPane.next.click();
        // SearchPage.previewPane.next.click();
        //
        // SearchPage.previewPane.previous.click();
        // SearchPage.previewPane.previous.click();
        // SearchPage.previewPane.previous.click();
        //
        // console.log( 'page number = ' + SearchPage.previewPane.pageNumber );
        // console.log( 'title = ' + SearchPage.previewPane.title );
        // console.log( 'topics on page = ' + SearchPage.previewPane.topicsOnThisPage );
        // console.log( 'topics on page highlights = ' + SearchPage.previewPane.topicsOnThisPageHighlights );
        // console.log( 'page pageText = ' + SearchPage.previewPane.pageText );
        // console.log( 'page pageTextHighlights = ' + SearchPage.previewPane.pageTextHighlights );

        console.log( SearchPage.previewPane.barChart.bars );
        console.log( SearchPage.previewPane.barChart.selectedPage() );
        console.log( SearchPage.previewPane.barChart.barForPage( 155 ).click() );
        console.log( SearchPage.previewPane.barChart.selectedPage() );

    } );
} );
