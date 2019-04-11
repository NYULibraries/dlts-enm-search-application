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
        browser.keys( '\uE006' );
    }
}

export default SearchForm;
