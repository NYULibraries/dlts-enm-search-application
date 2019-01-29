/* global browser:false setup:false suite:false test:false */

import { _ } from 'lodash';
import { assert } from 'chai';

import {
    jsonStableStringify,
} from '../util';

import SearchPage from '../pageobjects/search.page';

suite( 'Search form', function () {
    setup( function () {
        SearchPage.open();
    } );

    test( 'Google Analytics is enabled/disabled correctly',
        function () {
            const googleAnalytics = SearchPage.googleAnalytics;
            let expectedGoogleAnalytics = [];

            if ( browser.options.enmGoogleAnalytics ) {
                expectedGoogleAnalytics = [
                    '<script type="text/javascript" async="" src="https://www.google-analytics.com/analytics.js"></script>',
                    '<script async="" src="https://www.googletagmanager.com/gtag/js?id=UA-51495518-4"></script>',
                    '<script>window.dataLayer = window.dataLayer || [];\n        ' +
                    'function gtag(){dataLayer.push(arguments);}\n        ' +
                    "gtag('js', new Date());\n\n        " +
                    "gtag('config', 'UA-51495518-4', { 'anonymize_ip': true });</script>",
                ];
            }

            assert( _.isEqual( googleAnalytics, expectedGoogleAnalytics ),
                'Expected: ' + jsonStableStringify( expectedGoogleAnalytics ) + '\n' +
                'Got: ' + jsonStableStringify( googleAnalytics ) + '\n'
            );
        }
    );
} );
