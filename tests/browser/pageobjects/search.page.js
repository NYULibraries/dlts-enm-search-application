/* global browser:false $:false $$:false */

import crypto from 'crypto';

import Page from './page';

import LimitByTopicPane from './classes/LimitByTopicPane';
import Navbar from './classes/Navbar';
import PreviewPane from './classes/PreviewPane';
import ResultsPane from './classes/ResultsPane';
import SearchEcho from './classes/SearchEcho';
import SearchForm from './classes/SearchForm';

class SearchPage extends Page {
    constructor() {
        super();

        this.limitByTopicPane = new LimitByTopicPane();
        this.navbar           = new Navbar();
        this.previewPane      = new PreviewPane();
        this.resultsPane      = new ResultsPane();
        this.searchEcho       = new SearchEcho();
        this.searchForm       = new SearchForm();
    }

    get alertText() {
        return browser.getAlertText();
    }

    get baseUrl() {
        return browser.options.baseUrl;
    }

    get googleAnalytics() {
        return $$( 'head script' ).map( ( scriptElement ) => {
            return scriptElement.getHTML();
        } );
    }

    get paths() {
        return {
            about          : 'about.html',
            allTopics      : 'browse-topics-lists/a.html',
            browse         : 'browse-topics-lists/enm-picks.html',
            home           : '',
            featuredTopics : 'browse-topics-lists/enm-picks.html',
            search         : 'search',
        };
    }

    get spinner() {
        return $( '#spinner' );
    }

    get title() {
        return browser.getTitle();
    };

    open( options ) {
        let url = this.paths.search;

        if ( browser.config.solrFake ) {
            url += `?solr=${ browser.config.solrFake.url }`;

            if ( options && options.solrErrorSimulation ) {
                url += '&solrErrorSimulation=' + options.solrErrorSimulation;
            }
        }

        super.open( url );
    }

    dismissSearchDCIAndWaitForResults() {
        this.searchEcho.searchDCI.dismiss();

        this.resultsPane.results._element.waitForDisplayed();
    }

    dismissTopicDCIAndWaitForResults( topic ) {
        this.searchEcho.topicDCIs.dismiss( topic );

        this.resultsPane.results._element.waitForDisplayed();
    }

    limitByTopicAndWaitForResults( topic ) {
        if ( this.limitByTopicPane.topic( topic ).isExisting() ) {
            this.limitByTopicPane.topic( topic ).click();
        } else {
            this.limitByTopicPane.seeAllLink.click();
            this.limitByTopicPane.topic( topic ).waitForDisplayed( 5000 );
            this.limitByTopicPane.topic( topic ).click();
        }

        this.resultsPane.results._element.waitForDisplayed();
    }

    getPreviewId( query, searchFulltext, searchTopics, topicDCIsTopics, isbn, pageNumber ) {
        return this.getSearchId( query, searchFulltext, searchTopics, topicDCIsTopics ) +
               `-${ isbn }-${ pageNumber }`;
    }

    getPreviewIdForCurrentPreview() {
        return this.getPreviewId(
            this.searchForm.searchBox.getValue(),
            this.searchForm.fulltextCheckbox.isSelected,
            this.searchForm.topicsCheckbox.isSelected,
            this.searchEcho.topicDCIs.topics,
            this.previewPane.isbn,
            this.previewPane.pageNumber,
        );
    }

    getSearchId( query, searchFulltext, searchTopics, topicDCIsTopics ) {
        const hashQueryId = crypto.createHash( 'sha256' );
        const queryId     = hashQueryId.update( query ).digest( 'hex' );

        let basename = queryId;

        if ( searchFulltext ) {
            basename += '-fulltext';
        }

        if ( searchTopics ) {
            basename += '-topics';
        }

        if ( topicDCIsTopics.length > 0 ) {
            const hashTopicDCIsTopics   = crypto.createHash( 'sha256' );
            const topicDCIsTopicsString = topicDCIsTopics.sort().join( '|' );
            let topicDCIsTopicsKey      = hashTopicDCIsTopics.update( topicDCIsTopicsString ).digest( 'hex' );

            basename += '-' + topicDCIsTopicsKey;
        }

        return basename;
    }

    getSearchIdForCurrentSearch() {
        return this.getSearchId(
            this.searchForm.searchBox.getValue(),
            this.searchForm.fulltextCheckbox.isSelected,
            this.searchForm.topicsCheckbox.isSelected,
            this.searchEcho.topicDCIs.topics,
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

            query : this.searchForm.searchBox.getValue(),

            searchFulltext : this.searchForm.fulltextCheckbox.isSelected,
            searchTopics   : this.searchForm.topicsCheckbox.isSelected,

            topicsOnThisPage           : this.previewPane.topicsOnThisPage,
            topicsOnThisPageHighlights : this.previewPane.topicsOnThisPageHighlights,

            title : this.previewPane.title,

            barChartData         : this.previewPane.barChart.data,
            barChartSelectedPage : this.previewPane.barChart.selectedPage,
        };
    }

    search( query ) {
        // Previously was submitting the form using `browser.keys( '\uE006' )` in
        // SearchForm.submit method, but that seemed to cause problems in Search Form
        // tests.  See https://jira.nyu.edu/jira/browse/NYUP-619 for details.
        this.searchForm.searchBox.addValue( query + '\uE006' );
    }

    searchAndWaitForResults( query ) {
        this.search( query );
        this.resultsPane.results._element.waitForDisplayed();
    }

    searchResultsSnapshot() {
        return {
            id              : this.getSearchIdForCurrentSearch(),

            query           : this.searchForm.searchBox.getValue(),
            searchFulltext  : this.searchForm.fulltextCheckbox.isSelected,
            searchTopics    : this.searchForm.topicsCheckbox.isSelected,
            searchDCI       : this.searchEcho.searchDCI.query,
            topicsDCIs      : this.searchEcho.topicDCIs.topics,

            limitByTopics   : this.limitByTopicPane.topicNamesWithHitCounts,

            resultsNumBooks : this.resultsPane.header.numBooks,
            resultsNumPages : this.resultsPane.header.numPages,
            resultsMetadata : this.resultsPane.results.metadata(),
        };
    }

    setWindowSize( size ) {
        // size must be an object with width and height fields:
        // {
        //     width  : 500,
        //     height : 500,
        // }
        browser.setWindowSize( size.width, size.height );
    }
}

export default new SearchPage();
