/* global setup:false suite:false test:false */

import { assert } from 'chai';

import SearchPage from '../pageobjects/search.page';

suite( 'Navbar', function () {
    setup( function () {
        SearchPage.open();
    } );

    test( 'Clicking "About" takes user to About page', function () {
        SearchPage.open();
        SearchPage.navbar.about.click();

        assert.equal(  SearchPage.currentUrl, SearchPage.baseUrl + SearchPage.paths.about );
    } );

    test( 'Clicking "Browse" takes user to browse topics lists', function () {
        SearchPage.open();
        SearchPage.navbar.browse.click();

        assert.equal(  SearchPage.currentUrl, SearchPage.baseUrl + SearchPage.paths.browse );
    } );

    test( 'Clicking "All topics" under "Browse" menu takes user to all topics', function () {
        SearchPage.open();
        SearchPage.expandNavbarBrowseMenu();
        SearchPage.navbar.allTopics.click();

        assert.equal(  SearchPage.currentUrl, SearchPage.baseUrl + SearchPage.paths.allTopics );
    } );

    test( 'Clicking "Featured topics" under "Browse" menu takes user to featured topics', function () {
        SearchPage.open();
        SearchPage.expandNavbarBrowseMenu();
        SearchPage.navbar.featuredTopics.click();

        assert.equal(  SearchPage.currentUrl, SearchPage.baseUrl + SearchPage.paths.featuredTopics );
    } );

    test( 'Clicking "Search" takes user to search application', function () {
        SearchPage.open();
        SearchPage.navbar.search.click();

        assert.equal(  SearchPage.currentUrl, SearchPage.baseUrl + SearchPage.paths.search + '/' );
    } );
} );
