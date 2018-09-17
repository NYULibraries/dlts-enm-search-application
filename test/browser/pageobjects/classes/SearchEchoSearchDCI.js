/* global $:false */

class SearchEchoSearchDCI {
    get query() {
        return $( '//span[button[@id="search-dci"]]' )
            .getText()
            .replace( /^Searching full texts and topics for: /, '' );
    }

    dismiss() {
        return $( 'button#search-dci' ).click();
    }
}

export default SearchEchoSearchDCI;
