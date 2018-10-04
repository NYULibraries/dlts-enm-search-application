/* global $:false */

class ResultsPaneHeader {
    get text() {
        return $( 'div.enm-pane-results header' ).getText();
    }

    get numPages() {
        return this.numPagesAndBooks().numPages;
    }

    get numBooks() {
        return this.numPagesAndBooks().numBooks;
    }

    numPagesAndBooks() {
        let found = this.text.match( /Results: (.*) pages in (\d+) books/ );

        if ( found ) {
            return {
                numBooks : parseInt( found[ 2 ].replace( ',', '' ), 10 ),
                numPages : parseInt( found[ 1 ].replace( ',', '' ), 10 ),
            };
        } else {
            return {
                numBooks : NaN,
                numPages : NaN,
            };
        }
    };
}

export default ResultsPaneHeader;
