/* global $:false */

class SearchEchoSearchDCI {
    get label() {
        return this.labelAndQuery()[ 'label' ];
    }

    get query() {
        return this.labelAndQuery()[ 'query' ];
    }

    get text() {
        return $( '//span[button[@id="search-dci"]]' ).getText();
    }

    dismiss() {
        return $( 'button#search-dci' ).click();
    }

    labelAndQuery() {
        let found = this.text.match( /(.*): (.*)/ );

        if ( found ) {
            return {
                label : found[ 1 ],
                query : found[ 2 ],
            };
        } else {
            return {
                label : null,
                query : null,
            };
        }
    };
}

export default SearchEchoSearchDCI;
