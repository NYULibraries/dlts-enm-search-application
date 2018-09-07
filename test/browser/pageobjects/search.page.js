/* global browser:false $:false */

import Page from './page';

class SearchPage extends Page {
    get baseUrl() { return browser.options.baseUrl; }
    get path() { return 'prototypes/search-results'; }
    get navbar() {
        return {
            about: $( 'a.navbar-item=About' ),

            // Menu
            browse: $( 'a.navbar-link=Browse' ),
            // First item of Browse menu
            featuredTopics: $( 'a.navbar-item=Featured topics' ),
            // Second item of Browse menu
            allTopics: $( 'a.navbar-item=All topics' ),

            search: $( 'a.navbar-item=Search' ),
        };
    }
    get title() { return browser.getTitle(); };

    open() {
        // This is the real path, after the build is implemented.
        // super.open( 'search' );
        // For now use the prototype for writing of the tests.
        super.open( this.path );
    }
}

export default new SearchPage();
