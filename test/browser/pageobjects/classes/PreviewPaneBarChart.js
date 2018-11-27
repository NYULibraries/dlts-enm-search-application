/* global $:false $$:false */

class PreviewPaneBarChart {
    get data() {
        return $$( '.enm-pane-preview svg rect' ).map(
            ( bar ) => {
                return {
                    page   : bar.getAttribute( 'name' ),
                    x      : bar.getAttribute( 'x' ),
                    y      : bar.getAttribute( 'y' ),
                    width  : bar.getAttribute( 'width' ),
                    height : bar.getAttribute( 'height' ),
                    stroke : bar.getAttribute( 'stroke' ),
                };
            }
        );
    }

    // This returns whatever the tooltip element is that is currently in the DOM,
    // whether it is shown or hidden, whether the user is hovering over a
    // bar or not.
    get tooltip() {
        return $( '.d3-tip' );
    }

    barForPageNumber( pageNumber ) {
        return $( '.enm-pane-preview svg rect[ name = "' + pageNumber + '"]' );
    }

    // This doesn't work.  Perhaps `moveToObject()` can't trigger `mouseon` event
    // of an SVG element.
    // hoverBarForPageNumber( pageNumber ) {
    //     this.barForPageNumber( pageNumber ).moveToObject( 0, 0 );
    // }

    selectedPage() {
        let activeBar;

        try {
            activeBar = $( '.enm-page-active' );

            return activeBar.getAttribute( 'name' );
        } catch( e ) {
            console.error( e );

            return null;
        }
    }

    // This returns page number and score for whatever tooltip element is that
    // currently in the DOM,  whether it is shown or hidden, whether the user is
    // hovering over a bar or not.
    //
    // Because it doesn't seem possible to hover over a bar, can't implement
    // tooltipPageNumberAndScoreForPageNumber( pageNumber ), which would start with
    // `this.hoverBarForPageNumber( pageNumber )` to set the tooltip.
    //
    // To use this method, first click on the bar to set the tooltip.
    tooltipPageNumberAndScore() {
        // tooltip:
        // <div class="d3-tip n" style="position: absolute; top: 380.391px; opacity: 1; pointer-events: all; box-sizing: border-box; left: 1204.48px;">
        //     Page: 160
        //     <br>
        //     <span class="tooltip-score">
        //         Score: 1.7577121
        //     </span>
        // </div>

        // This doesn't work:
        //
        //     let tooltipText = this.tooltip.getText();
        //
        // ...for some reason getText() always returns empty string.
        //
        // Tested in REPL and am able to reproduce the bug:
        //     > $( '.d3-tip' )
        //         { sessionId: 'e6e15f226e4bfc98ebeae716e38992c8',
        //             value:
        //             { ELEMENT: '0.36728083700126035-1',
        //                 'element-6066-11e4-a52e-4f735466cecf': '0.36728083700126035-1' },
        //             selector: '.d3-tip',
        //                 _status: 0 }
        //     > $( '.d3-tip' ).getText()
        //         ''
        //     > browser.getHTML( '.d3-tip' )
        // '<div class="d3-tip n" style="position: absolute;top: 271.391px;opacity: 0;pointer-events: none;box-sizing: border-box;left: 888.484px;">Page: 156<br><span class="tooltip-score">Score: 6.755904</span></div>'
        //     >

        let tooltipHtml = this.tooltip.getHTML();
        let found       = tooltipHtml.match( /Page: (\S+)<br>.*Score: ([\d.]+)<\/span>/ );

        if ( found ) {
            return {
                pageNumber : found[ 1 ],
                score      : found[ 2 ],
            };
        } else {
            return {
                pageNumber : NaN,
                score      : NaN,
            };
        }
    }
}

export default PreviewPaneBarChart;
