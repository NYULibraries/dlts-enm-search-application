/* global browser:false $:false */

import Page from './page';

class SearchPage extends Page {
    get baseUrl() { return browser.options.baseUrl; }
    get paths() {
        return {
            about: 'prototypes/about.html',
            allTopics: 'prototypes/browse-topics-lists/a.html',
            browse: 'prototypes/browse-topics-lists/enm-picks.html',
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

            search: $( 'a.navbar-item=Search' ),
        };
    }
    get title() { return browser.getTitle(); };

    open() {
        // This is the real path, after the build is implemented.
        // super.open( 'search' );
        // For now use the prototype for writing of the tests.
        super.open( this.paths.search );
    }
}

export default new SearchPage();
