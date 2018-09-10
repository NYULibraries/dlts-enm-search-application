/* global browser:false $:false */

import Page from './page';

class SearchPage extends Page {
    get alertText() { return browser.alertText; }

    get baseUrl() { return browser.options.baseUrl; }

    get paths() {
        return {
            about: 'prototypes/about.html',
            allTopics: 'prototypes/browse-topics-lists/a.html',
            browse: 'prototypes/browse-topics-lists/enm-picks.html',
            home: 'prototypes/',
            featuredTopics: 'prototypes/browse-topics-lists/enm-picks.html',
            search: 'prototypes/search-results',
        };
    }

    get navbar() {
        return {
            about: $( 'a.navbar-item=About' ),

            // Menu
            browse: $( 'a.navbar-link=Browse' ),
            // First item of Browse menu
            featuredTopics: $( 'a.navbar-item=Featured topics' ),
            // Second item of Browse menu
            allTopics: $( 'a.navbar-item=All topics' ),

            home: $( 'h1.enm-logo' ),

            search: $( 'a.navbar-item=Search' ),
        };
    }

    get resultsPane() {
        return {
            header  : {
                text : $( 'div.enm-pane-results header' ).getText(),
            },
            results : {
                _element : $( 'div.enm-results' ),
                text     : $( 'div.enm-results' ).getText(),
            },
        };
    }

    get searchForm() {
        return {
            searchBox        : $( '#enm-searchinput' ),
            fulltextCheckbox : $( '#fulltextChx' ),
            topicsCheckbox   : $( '#topicsChx' ),

            submit: function () {
                browser.submitForm( 'form.enm-searchform' );
            },
        };
    }

    get spinner() {
        return $( '#spinner' );
    }

    get title() { return browser.getTitle(); };

    open() {
        // This is the real path, after the build is implemented.
        // super.open( 'search' );
        // For now use the prototype for writing of the tests.
        super.open( this.paths.search );
    }

    expandNavbarBrowseMenu() {
        // Note this will need to be replaced with Actions command.
        // See https://github.com/webdriverio/webdriverio/issues/2140
        this.navbar.browse.moveToObject( 0, 0 );
    }

    // These can't be run in resultsPane getter because it fails if search hasn't
    // been submitted and run to completion.
    getResultsPaneNumBooks() {
        return this.getResultsPaneNumBooksAndPages().numBooks;
    }
    getResultsPaneNumPages() {
        return this.getResultsPaneNumBooksAndPages().numPages;
    }
    getResultsPaneNumBooksAndPages( index ) {
        let found = this.resultsPane.header.text.match( /Results: (.*) pages in (\d+) books/ );

        if ( found ) {
            return {
                numBooks : parseInt( found[ 2 ].replace( ',', '' ), 10 ),
                numPages : parseInt( found[ 1 ].replace( ',', '' ), 10 ),
            };
        } else {
            return {
                numBooks : NaN,
                numPages : NaN,
            };
        }
    }

    search( query ) {
        this.searchForm.searchBox.addValue( query );
        this.searchForm.submit();
    }

    searchAndWaitForResults( query ) {
        this.searchForm.searchBox.addValue( query );
        this.searchForm.submit();
        this.resultsPane.results._element.waitForVisible( 30000 );
    }
}

export default new SearchPage();
