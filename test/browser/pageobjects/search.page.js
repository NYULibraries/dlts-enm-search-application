/* global browser:false $:false $$:false */

import Page from './page';

class SearchPage extends Page {
    get alertText() { return browser.alertText; }

    get baseUrl() { return browser.options.baseUrl; }

    get limitByTopicPane() {
        return {
            click : ( topic ) => {
                $( 'a[ id = "' + topic + '" ]' ).click();
            },
            seeAllLink : $( 'a=See All' ),
            seeLessLink : $( 'a=See Less' ),
            topicsWithHitCounts : $$( '.enm-facets-group-visible a' ).map(
                ( topicItem ) => {
                    const found = topicItem.getText().match( /^(.*) \((\d+)\)$/ );
                    return [ found[ 1 ], parseInt( found[ 2 ], 10 ) ];
                }
            ),
        };
    }

    get navbar() {
        return {
            about: $( 'a.navbar-item=About' ),

            // Menu
            browse: {
                _element : $( 'a.navbar-link=Browse' ),
                click    : () => { $( 'a.navbar-link=Browse' ).click(); },
                expand   : () => { $( 'a.navbar-link=Browse' ).moveToObject( 0, 0 ); },
            },

            // First item of Browse menu
            featuredTopics: $( 'a.navbar-item=Featured topics' ),

            // Second item of Browse menu
            allTopics: $( 'a.navbar-item=All topics' ),

            home: $( 'h1.enm-logo' ),

            search: $( 'a.navbar-item=Search' ),
        };
    }

    get paths() {
        return {
            about: 'prototypes/about.html',
            allTopics: 'prototypes/browse-topics-lists/a.html',
            browse: 'prototypes/browse-topics-lists/enm-picks.html',
            home: 'prototypes/',
            featuredTopics: 'prototypes/browse-topics-lists/enm-picks.html',
            search: 'prototypes/search-results',
        };
    }

    get resultsPane() {
        return {
            header  : {
                text : $( 'div.enm-pane-results header' ).getText(),
                numPages: () => {
                    return this.resultsPane.header.numPagesAndBooks().numPages;
                },
                numBooks: () => {
                    return this.resultsPane.header.numPagesAndBooks().numBooks;
                },
                numPagesAndBooks: () => {
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
            },
            results : {
                _element : $( '.enm-results' ),
            },
        };
    }

    get searchEcho() {
        return {
            searchDCI : {
                dismiss  : () => { $( 'button#search-dci' ).click(); },

                query    : $( '//span[button[@id="search-dci"]]' )
                    .getText()
                    .replace( /^Searching full texts and topics for: /, '' ),
            },
            topicDCIs : {
                dismiss : ( topic ) => { return $( 'button[ id="' + topic + '" ]' ).click(); },

                topics  : $$( 'span.enm-topic' ).map(
                    ( topicDCI ) => { return topicDCI.getText(); }
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

            fulltext : {
                click      : () => { $( 'label[ for="fulltextChx" ]' ).click(); },
                isSelected : () => { return $( '#fulltextChx' ).isSelected(); },
                text       : $( '#fulltextChx' ).getText(),
            },
            topics : {
                click      : () => { $( 'label[ for="topicsChx" ]' ).click(); },
                isSelected : () => { return $( '#topicsChx' ).isSelected(); },
                text       : $( '#topicsChx' ).getText(),
            },

            submit: function () {
                browser.submitForm( 'form.enm-searchform' );
            },
        };
    }

    get spinner() {
        return $( '#spinner' );
    }

    get title() { return browser.getTitle(); };

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
        this.resultsPane.results._element.waitForVisible( 30000 );
    }
}

export default new SearchPage();
