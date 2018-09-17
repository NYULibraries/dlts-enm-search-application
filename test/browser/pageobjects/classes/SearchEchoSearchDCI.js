/* global $:false */

class SearchEchoSearchDCI {
    get query() {
        return $( '//span[button[@id="search-dci"]]' )
            .getText()
            .replace( /^[^:]+: /, '' );
    }

    dismiss() {
        return $( 'button#search-dci' ).click();
    }
}

export default SearchEchoSearchDCI;
