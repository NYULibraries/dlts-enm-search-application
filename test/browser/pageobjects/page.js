/* global browser:false */

export default class Page {
    get currentUrl() { return browser.getUrl(); }

    open( path ) {
        browser.url( path );
    }
};
