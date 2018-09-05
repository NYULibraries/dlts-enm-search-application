/* global browser:false */

export default class Page {
    open( path ) {
        browser.url( path );
    }
};
