/* global setup:false suite:false test:false */

import { assert } from 'chai';

import SearchPage from '../pageobjects/search.page';

suite( 'Navbar', function () {
    setup( function () {
        SearchPage.open();
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
        SearchPage.expandNavbarBrowseMenu();
        SearchPage.navbar.allTopics.click();

        assert.equal(  SearchPage.currentUrl, SearchPage.baseUrl + SearchPage.paths.allTopics );
    } );

    test( 'Clicking "Featured topics" under "Browse" menu takes user to featured topics', function () {
        SearchPage.expandNavbarBrowseMenu();
        SearchPage.navbar.featuredTopics.click();

        assert.equal(  SearchPage.currentUrl, SearchPage.baseUrl + SearchPage.paths.featuredTopics );
    } );

    test( 'Clicking "ENHANCED NETWORKED MONOGRAPHS" logo takes user to home page', function () {
        SearchPage.navbar.home.click();

        assert.equal(  SearchPage.currentUrl, SearchPage.baseUrl + SearchPage.paths.home );
    } );

    test( 'Clicking "Search" takes user to search application', function () {
        SearchPage.navbar.search.click();

        assert.equal(  SearchPage.currentUrl, SearchPage.baseUrl + SearchPage.paths.search + '/' );
    } );
} );
