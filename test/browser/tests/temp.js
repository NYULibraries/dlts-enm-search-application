/* global suite:false test:false */

import { assert } from 'chai';

import SearchPage from '../pageobjects/search.page';

suite( 'Temp', function () {
    test( 'Title is correct', function () {
        SearchPage.open();

        let title = SearchPage.title;

        assert.equal( title, 'ENM Search Results - Prototype', 'title is correct' );
    } );
} );
