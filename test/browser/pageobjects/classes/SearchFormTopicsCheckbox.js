/* global $:false */

class SearchFormTopicsCheckbox {
    get isSelected() {
        return $( '#topicsChx' ).isSelected();
    }

    get text() {
        return $( '#topicsChx' ).getText();
    }

    //  NOTE: We click the labels for select/de-select because they obscure
    // the checkboxes themselves.  Trying to click checkboxes produces an
    // error like this:
    //
    //     Element <input type="checkbox" name="topicsChx" id="topicsChx" class="is-medium is-checkbox" value="topicNames"> is not clickable at point (767, 106). Other element would receive the click: <label for="topicsChx">...</label>
    click() {
        return $( 'label[ for="topicsChx" ]' ).click();
    }
}

export default SearchFormTopicsCheckbox;
