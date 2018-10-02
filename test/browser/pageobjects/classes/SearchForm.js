/* global browser:false $:false */

import SearchFormFulltextCheckbox from './SearchFormFulltextCheckbox';
import SearchFormTopicsCheckbox from './SearchFormTopicsCheckbox';

class SearchForm {
    constructor() {
        this.fulltextCheckbox = new SearchFormFulltextCheckbox();
        this.topicsCheckbox = new SearchFormTopicsCheckbox();
    }

    get searchBox() {
        return $( '#enm-searchinput' );
    }

    submit() {
        this.searchBox.click();
        if ( browser.options.desiredCapabilities.browserName === 'firefox' ) {
            // This is not ideal, as `submit` is deprecated.  WebdriverIO warning:
            //
            // WARNING: the "submit" command will be deprecated soon. If you have further questions, reach out in the WebdriverIO Gitter support channel (https://gitter.im/webdriverio/webdriverio).
            // Note: This command is not part of the W3C WebDriver spec and won't be supported in future versions of the driver. It is recommended to call the click command on the submit button or use the actions command to emulate a key press action.
            //
            // (You can disable this warning by setting `"deprecationWarnings": false` in your WebdriverIO config)
            //
            // See https://jira.nyu.edu/jira/browse/NYUP-451
            browser.submitForm( '#enm-searchinput' );
        } else {
            browser.keys( '\uE006' );
        }
    }
}

export default SearchForm;
