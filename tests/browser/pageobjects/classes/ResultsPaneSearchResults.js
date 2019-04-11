/* global $:false $$:false */

class ResultsPaneSearchResults {
    get _element() {
        return $( '.enm-results' );
    }

    book( title ) {
        return $( '.enm-results div[ name = "' + title + '" ]' );
    }

    metadata() {
        let results = $$( '.enm-results div.box' );
        let books   = [];

        results.forEach( ( result ) => {
            const id = result.getAttribute( 'id' );
            const parentElementSelector = `div[ id = "${ id }" ]`;

            let book = {};

            book.authorsAndPublisher       = $( `${ parentElementSelector } .meta` ).getText();
            book.isbn                      = id;
            book.maximumPageRelevanceScore =
                // Leave the score as a string, don't mess with JS floats
                $( `${ parentElementSelector } .relevance` )
                    .getText()
                    .match( /Maximum page relevance score: (\S+)/ )[ 1 ];
            book.numMatchedPages           =
                parseInt(
                    $( `${ parentElementSelector } .matches` )
                        .getText()
                        .match( /(\d+) matched pages/ )[ 1 ],
                    10
                );
            book.thumbnail = new URL( $( `${ parentElementSelector }.enm-thumbnail img` ).getAttribute( 'src' ) ).pathname;
            book.title     = $( `${ parentElementSelector } .title` ).getText();

            books.push( book );
        } );

        return books;
    };
}

export default ResultsPaneSearchResults;
