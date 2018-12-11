/* global setup:false suite:false test:false */

import { assert } from 'chai';

import SearchPage from '../pageobjects/search.page';

suite( 'Navbar', function () {
    setup( function () {
        SearchPage.open();
        // Setting to wider width to prevent errors with navbar not being visible
        // when running full test suite.
        // See https://jira.nyu.edu/jira/browse/NYUP-454
        // It's unknown what the minimum width should be, but 1600 is used
        // in Preview Pane tests and that width fixes the problem here, so using
        // 1600 for consistency.
        SearchPage.setViewportSize(
            {
                height : 851,
                width  : 1600,
            }
        );
    } );

    test( 'Clicking "About" takes user to About page', function () {
        SearchPage.navbar.about.click();

        assert.equal(  SearchPage.currentUrl, SearchPage.baseUrl + SearchPage.paths.about );
    } );

    test( 'Clicking "Browse" takes user to browse topics lists', function () {
        SearchPage.navbar.browse.click();

        assert.equal(  SearchPage.currentUrl, SearchPage.baseUrl + SearchPage.paths.browse );
    } );

    test( 'Clicking "All topics" under "Browse" menu takes user to all topics', function () {
        SearchPage.navbar.browse.expand();
        SearchPage.navbar.browse.allTopics.click();

        assert.equal(  SearchPage.currentUrl, SearchPage.baseUrl + SearchPage.paths.allTopics );
    } );

    test( 'Clicking "Featured topics" under "Browse" menu takes user to featured topics', function () {
        SearchPage.navbar.browse.expand();
        SearchPage.navbar.browse.featuredTopics.click();

        assert.equal(  SearchPage.currentUrl, SearchPage.baseUrl + SearchPage.paths.featuredTopics );
    } );

    test( 'Clicking "ENHANCED NETWORKED MONOGRAPHS" logo takes user to home page', function () {
        SearchPage.navbar.home.click();

        assert.equal(  SearchPage.currentUrl, SearchPage.baseUrl + SearchPage.paths.home );
    } );

    test( 'Clicking "Search" takes user to search application', function () {
        SearchPage.navbar.search.click();

        assert(
            SearchPage.currentUrl === SearchPage.baseUrl + SearchPage.paths.search + '/' ||
            SearchPage.currentUrl === SearchPage.baseUrl + SearchPage.paths.search + '/#/'
        );
    } );
} );
