/* global $:false $$:false */

import BarChart from './BarChart';

class PreviewPane {
    constructor() {
        this.barChart = new BarChart();
    }

    get isbn() {
        // 'TODO'
    }

    get loadTheFirstMatchedPageLink() {
        return $( '=Load the first matched page' );
    }

    get next() {
        return $( 'a.button=next >' );
    }

    get pageNumber() {
        return $( '.enm-pane-preview .enm-pageno' ).getText();
    }

    get pageText() {
        return $( '.enm-pageText' ).getText();
    }

    get pageTextHighlights() {
        return $$( '.enm-pageText mark' ).map(
            ( highlight ) => {
                return highlight.getText();
            }
        );
    }

    get previous() {
        return $( 'a.button=< previous' );
    }

    get title() {
        return $( '.enm-pane-preview .title' ).getText();
    }

    get topicsOnThisPage() {
        $$( '.enm-topicsonthispage li a' ).map(
            ( highlight ) => {
                return highlight.getText();
            }
        );
    }

    get topicsOnThisPageHighlights() {
        return $$( '.enm-topicsonthispage li a mark' ).map(
            ( highlight ) => {
                return highlight.getText();
            }
        );
    }
}

export default PreviewPane;
