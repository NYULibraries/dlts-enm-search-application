/* global $:false */

class SearchFormFulltextCheckbox {
    get isSelected() {
        return $( '#fulltextChx' ).isSelected();
    }

    get text() {
        return $( '#fulltextChx' ).getText();
    }

    //  NOTE: We click the labels for select/de-select because they obscure
    // the checkboxes themselves.  Trying to click checkboxes produces an
    // error like this:
    //
    //     Element <input type="checkbox" name="fulltextChx" id="fulltextChx" class="is-medium is-checkbox" value="pageText"> is not clickable at point (630, 106). Other element would receive the click: <label for="fulltextChx">...</label>
    click() {
        return $( 'label[ for="fulltextChx" ]' ).click();
    }
}

export default SearchFormFulltextCheckbox;
