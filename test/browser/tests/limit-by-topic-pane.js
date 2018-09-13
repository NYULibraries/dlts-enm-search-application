/* global setup:false suite:false test:false */

import { assert } from 'chai';

import SearchPage from '../pageobjects/search.page';

suite( 'Limit by Topic Pane', function () {
    setup( function () {
        SearchPage.open();
    } );
} );
