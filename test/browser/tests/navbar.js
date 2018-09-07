/* global suite:false test:false */

import { assert } from 'chai';

import SearchPage from '../pageobjects/search.page';

suite( 'Navbar', function () {
    test( 'Clicking "Search" takes user to Search', function () {
        SearchPage.open();
        SearchPage.navbar.search.click();

        assert.equal(  SearchPage.currentUrl, SearchPage.baseUrl + SearchPage.path + '/' );
    } );
} );
