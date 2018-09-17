/* global browser:false $:false $$:false */

import crypto from 'crypto';

import Page from './page';

import LimitByTopicPane from './classes/LimitByTopicPane';
import Navbar from './classes/Navbar';
import PreviewPane from './classes/PreviewPane';
import ResultsPane from './classes/ResultsPane';

class SearchPage extends Page {
    constructor() {
        super();

        this.limitByTopicPane = new LimitByTopicPane();
        this.navbar = new Navbar();
        this.previewPane = new PreviewPane();
        this.resultsPane = new ResultsPane();
    }

    get alertText() {
        return browser.alertText;
    }

    get baseUrl() {
        return browser.options.baseUrl;
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

    static getPreviewId( query, searchFulltext, searchTopics, isbn, pageNumber ) {
        return this.getSearchId( query, searchFulltext, searchTopics ) +
               `-${isbn}-${pageNumber}.json`;
    }

    static getSearchId( query, searchFulltext, searchTopics ) {
        const hash    = crypto.createHash( 'sha256' );
        const queryId = hash.update( query ).digest( 'hex' );

        let basename = queryId;

        if ( searchFulltext ) {
            basename += '-fulltext';
        }

        if ( searchTopics ) {
            basename += '-topics';
        }

        return basename;
    }

    open() {
        // This is the real path, after the build is implemented.
        // super.open( 'search' );
        // For now use the prototype for writing of the tests.
        super.open( this.paths.search );
    }

    getPreviewIdForCurrentPreview() {
        return SearchPage.getPreviewId(
            this.searchForm.searchBox.getValue(),
            this.searchForm.fulltextCheckbox.isSelected(),
            this.searchForm.topicsCheckbox.isSelected(),
            this.previewPane.isbn,
            this.previewPane.pageNumber,
        );
    }

    getSearchIdForCurrentSearch() {
        return SearchPage.getSearchId(
            this.searchForm.searchBox.getValue(),
            this.searchForm.fulltextCheckbox.isSelected(),
            this.searchForm.topicsCheckbox.isSelected(),
        );
    }

    previewSnapshot() {
        // Pre-condition: preview pane must have a page selected for preview
        return {
            id : this.getPreviewIdForCurrentPreview(),

            isbn : this.previewPane.isbn,

            pageNumber : this.previewPane.pageNumber,

            pageText           : this.previewPane.pageText,
            pageTextHighlights : this.previewPane.pageTextHighlights,

            topicsOnThisPage           : this.previewPane.topicsOnThisPage,
            topicsOnThisPageHighlights : this.previewPane.topicsOnThisPageHighlights,

            title : this.previewPane.title,

            barChartData         : this.previewPane.barChart.data,
            barChartSelectedPage : this.previewPane.barChart.selectedPage,
        };
    }

    search( query ) {
        this.searchForm.searchBox.addValue( query );
        this.searchForm.submit();
    }

    searchAndWaitForResults( query ) {
        this.searchForm.searchBox.addValue( query );
        this.searchForm.submit();
        this.resultsPane.results._element.waitForVisible();
    }

    searchResultsSnapshot() {
        return {
            id              : this.getSearchIdForCurrentSearch(),

            query           : this.searchForm.searchBox.getValue(),
            searchFulltext  : this.searchForm.fulltextCheckbox.isSelected(),
            searchTopics    : this.searchForm.topicsCheckbox.isSelected(),
            searchDCI       : this.searchEcho.searchDCI.query,
            topicsDCIs      : this.searchEcho.topicsDCIs ? this.searchEcho.topicsDCIs.topics : [],

            limitByTopics   : this.limitByTopicPane.topicNamesWithHitCounts,

            resultsNumBooks : this.resultsPane.header.numBooks,
            resultsNumPages : this.resultsPane.header.numPages,
            resultsMetadata : this.resultsPane.results.metadata(),
        };
    }
}

export default new SearchPage();
