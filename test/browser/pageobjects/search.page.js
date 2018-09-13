/* global browser:false $:false $$:false */

import Page from './page';

class SearchPage extends Page {
    get alertText() {
        return browser.alertText;
    }

    get baseUrl() {
        return browser.options.baseUrl;
    }

    get limitByTopicPane() {
        return {
            seeAllLink  : $( 'a=See All' ),
            seeLessLink : $( 'a=See Less' ),

            topic : ( topic ) => {
                $( 'a[ id = "' + topic + '" ]' );
            },

            topicNamesWithHitCounts : $$( '.enm-facets-group-visible a' ).map(
                ( topicItem ) => {
                    const found = topicItem.getText().match( /^(.*) \((\d+)\)$/ );
                    return [ found[ 1 ], parseInt( found[ 2 ], 10 ) ];
                }
            ),
        };
    }

    get navbar() {
        return {
            about : $( 'a.navbar-item=About' ),

            // Menu
            browse : {
                _element : $( 'a.navbar-link=Browse' ),
                click    : () => {
                    $( 'a.navbar-link=Browse' ).click();
                },
                expand   : () => {
                    $( 'a.navbar-link=Browse' ).moveToObject( 0, 0 );
                },
            },

            // First item of Browse menu
            featuredTopics : $( 'a.navbar-item=Featured topics' ),

            // Second item of Browse menu
            allTopics : $( 'a.navbar-item=All topics' ),

            home : $( 'h1.enm-logo' ),

            search : $( 'a.navbar-item=Search' ),
        };
    }

    get paths() {
        return {
            about          : 'prototypes/about.html',
            allTopics      : 'prototypes/browse-topics-lists/a.html',
            browse         : 'prototypes/browse-topics-lists/enm-picks.html',
            home           : 'prototypes/',
            featuredTopics : 'prototypes/browse-topics-lists/enm-picks.html',
            search         : 'prototypes/search-results',
        };
    }

    get previewPane() {
        return {
            barChart : {
                bars                 : $$( '.enm-pane-preview svg rect' ),
                barForPage           : ( page ) => {
                    return $( '.enm-pane-preview svg rect[ name = "' + page + '"]' );
                },
                selectedPage         : () => {
                    let activeBar;

                    try {
                        activeBar = $( '.enm-page-active' );

                        return activeBar.getAttribute( 'name' );
                    } catch( e ) {
                        console.error( e );

                        return null;
                    }
                },
            },

            loadTheFirstMatchedPageLink : $( '=Load the first matched page' ),
            next                        : $( 'a.button=next >' ),
            pageNumber                  : $( '.enm-pane-preview .enm-pageno' ).getText(),
            pageText                    : $( '.enm-pageText' ).getText(),
            pageTextHighlights          : $$( '.enm-pageText mark' ).map(
                ( highlight ) => {
                    return highlight.getText();
                }
            ),
            previous                    : $( 'a.button=< previous' ),
            title                       : $( '.enm-pane-preview .title' ).getText(),
            topicsOnThisPage            : $$( '.enm-topicsonthispage li a' ).map(
                ( highlight ) => {
                    return highlight.getText();
                }
            ),
            topicsOnThisPageHighlights  : $$( '.enm-topicsonthispage li a mark' ).map(
                ( highlight ) => {
                    return highlight.getText();
                }
            ),
        };
    }

    get resultsPane() {
        return {
            header  : {
                numPages         : () => {
                    return this.resultsPane.header.numPagesAndBooks().numPages;
                },
                numBooks         : () => {
                    return this.resultsPane.header.numPagesAndBooks().numBooks;
                },
                numPagesAndBooks : () => {
                    let found = this.resultsPane.header.text.match( /Results: (.*) pages in (\d+) books/ );

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
                },
                text             : $( 'div.enm-pane-results header' ).getText(),
            },
            results : {
                _element : $( '.enm-results' ),
                book     : ( title ) => {
                    return $( '.enm-results div[ name = "' + title + '" ]' );
                },
                metadata : () => {
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
                },
            },
        };
    }

    get searchEcho() {
        return {
            searchDCI : {
                dismiss : () => {
                    $( 'button#search-dci' ).click();
                },

                query : $( '//span[button[@id="search-dci"]]' )
                    .getText()
                    .replace( /^Searching full texts and topics for: /, '' ),
            },
            topicDCIs : {
                dismiss : ( topic ) => {
                    return $( 'button[ id="' + topic + '" ]' ).click();
                },

                topics : $$( 'span.enm-topic' ).map(
                    ( topicDCI ) => {
                        return topicDCI.getText();
                    }
                ),
            },
        };
    }

    get searchForm() {
        return {
            searchBox : $( '#enm-searchinput' ),

            //  NOTE: We click the labels for select/de-select because they obscure
            // the checkboxes themselves.  Trying to click checkboxes produces an
            // error like this:
            //
            //     Element <input type="checkbox" name="fulltextChx" id="fulltextChx" class="is-medium is-checkbox" value="pageText"> is not clickable at point (630, 106). Other element would receive the click: <label for="fulltextChx">...</label>

            fulltextCheckbox : {
                click      : () => {
                    $( 'label[ for="fulltextChx" ]' ).click();
                },
                isSelected : () => {
                    return $( '#fulltextChx' ).isSelected();
                },
                text       : $( '#fulltextChx' ).getText(),
            },
            topicsCheckbox : {
                click      : () => {
                    $( 'label[ for="topicsChx" ]' ).click();
                },
                isSelected : () => {
                    return $( '#topicsChx' ).isSelected();
                },
                text       : $( '#topicsChx' ).getText(),
            },

            submit : function () {
                browser.submitForm( 'form.enm-searchform' );
            },
        };
    }

    get spinner() {
        return $( '#spinner' );
    }

    get title() {
        return browser.getTitle();
    };

    open() {
        // This is the real path, after the build is implemented.
        // super.open( 'search' );
        // For now use the prototype for writing of the tests.
        super.open( this.paths.search );
    }

    search( query ) {
        this.searchForm.searchBox.addValue( query );
        this.searchForm.submit();
    }

    searchAndWaitForResults( query ) {
        this.searchForm.searchBox.addValue( query );
        this.searchForm.submit();
        this.resultsPane.results._element.waitForVisible( 5000 );
    }
}

export default new SearchPage();
