/* global browser:false */

import Page from './page';

class SearchPage extends Page {
    get title() { return browser.getTitle(); };

    open() {
        // This is the real path, after the build is implemented.
        // super.open( 'search' );
        // For now use the prototype for writing of the tests.
        super.open( 'prototypes/search-results' );
    }
}

export default new SearchPage();
