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
            let book = {};

            book.authorsAndPublisher       = result.element( '.meta' ).getText();
            book.isbn                      = result.getAttribute( 'id' );
            book.maximumPageRelevanceScore =
                // Leave the score as a string, don't mess with JS floats
                result.element( '.relevance' )
                    .getText()
                    .match( /Maximum page relevance score: (\S+)/ )[ 1 ];
            book.numMatchedPages           =
                parseInt(
                    result.element( '.matches' )
                        .getText()
                        .match( /(\d+) matched pages/ )[ 1 ],
                    10
                );
            book.thumbnail                 = result.element( '.enm-thumbnail img' ).getAttribute( 'src' );
            book.title                     = result.element( '.title' ).getText();

            books.push( book );
        } );

        return books;
    };
}

export default ResultsPaneSearchResults;
